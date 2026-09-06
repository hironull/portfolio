#!/usr/bin/env bash
set -Eeuo pipefail

VERSION="1.3.0"
APP="Pterodactyl DDoS Mitigation by Syncara Cloud"
BIN="/usr/local/sbin/ptero-guard"
CONF="/etc/ptero-guard.conf"
SERVICE="/etc/systemd/system/ptero-guard.service"
TABLE="ptero_detect"
ALLOWLIST="/etc/ptero-guard-allowlist"
BLOCKLIST="/etc/ptero-guard-blocklist"
AI_KEY_FILE="/etc/ptero-guard-gemini.key"
DISCORD_WEBHOOK_SELECTED=""
TCP_PORT_SET=""
UDP_PORT_SET=""
AUTO_BLOCK_TIMEOUT="30m"
AI_ENABLED="no"
AI_MODEL="gemini-2.5-flash"
AI_INTERVAL_SECONDS=60
GEMINI_API_KEY_SELECTED=""

C_RESET="\033[0m"
C_RED="\033[31m"
C_GREEN="\033[32m"
C_YELLOW="\033[33m"
C_BLUE="\033[34m"
C_CYAN="\033[36m"
C_BOLD="\033[1m"

info() { echo -e "${C_BLUE}[INFO]${C_RESET} $*"; }
ok()   { echo -e "${C_GREEN}[ OK ]${C_RESET} $*"; }
warn() { echo -e "${C_YELLOW}[WARN]${C_RESET} $*"; }
fail() { echo -e "${C_RED}[FAIL]${C_RESET} $*" >&2; }
die()  { fail "$*"; exit 1; }

ask_yes_no() {
  local prompt="$1" default="${2:-Y}" answer
  if [[ "$default" == "Y" ]]; then
    read -r -p "$prompt [Y/n]: " answer
    answer="${answer:-Y}"
  else
    read -r -p "$prompt [y/N]: " answer
    answer="${answer:-N}"
  fi
  [[ "$answer" =~ ^[Yy]$ ]]
}

ask_value() {
  local prompt="$1" default="$2" out
  read -r -p "$prompt [$default]: " out
  printf '%s' "${out:-$default}"
}

require_root() {
  [[ ${EUID:-$(id -u)} -eq 0 ]] || die "Run the installer as root."
}

detect_os() {
  [[ -r /etc/os-release ]] || die "/etc/os-release was not found."
  # shellcheck disable=SC1091
  source /etc/os-release
  case "${ID:-}" in
    debian)
      [[ "${VERSION_ID:-}" == "13" ]] || warn "This installer targets Debian 13; Debian ${VERSION_ID:-unknown} was detected."
      ;;
    ubuntu)
      warn "This installer targets Debian 13; Ubuntu ${VERSION_ID:-unknown} was detected."
      ;;
    *)
      die "Unsupported operating system: ${ID:-unknown}"
      ;;
  esac
}

detect_wan() {
  ip -4 route show default | awk 'NR==1 {print $5}'
}

detect_public_ip() {
  local wan="$1"
  ip -4 -o addr show dev "$wan" scope global 2>/dev/null |
    awk 'NR==1 {split($4,a,"/"); print a[1]}'
}

install_deps() {
  info "Installing dependencies..."
  apt-get update
  DEBIAN_FRONTEND=noninteractive apt-get install -y nftables curl jq ca-certificates iproute2
  ok "Dependencies are ready."
}

backup_firewall() {
  local dir="/root/ptero-guard-backup" ts
  mkdir -p "$dir"
  ts="$(date +%F-%H%M%S)"

  nft list ruleset > "$dir/nft-$ts.conf" 2>/dev/null || true
  iptables-save > "$dir/iptables-$ts.rules" 2>/dev/null || true
  ip6tables-save > "$dir/ip6tables-$ts.rules" 2>/dev/null || true

  ok "Firewall backup saved to $dir"
}

valid_webhook_format() {
  [[ "$1" =~ ^https://(discord(app)?\.com)/api/webhooks/[0-9]+/[A-Za-z0-9._-]+ ]]
}

test_webhook_direct() {
  local webhook="$1" node="$2" ip="$3" code payload

  payload="$(jq -n \
    --arg node "$node" \
    --arg ip "$ip" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"✅ Discord Webhook Connected",
        description:"The Ptero Guard installer connected to Discord successfully.",
        color:3066993,
        fields:[
          {name:"Node",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$ip+"`"),inline:true},
          {name:"Status",value:"Installer Test",inline:true}
        ],
        footer:{text:"Ptero Guard Installer"}
      }]
    }')"

  code="$(curl --silent --show-error \
    --output /tmp/ptero-guard-webhook-test.out \
    --write-out '%{http_code}' \
    --max-time 12 \
    -H 'Content-Type: application/json' \
    -X POST \
    -d "$payload" \
    "$webhook" || true)"

  [[ "$code" == "204" || "$code" == "200" ]]
}

discord_wizard() {
  local node="$1" ip="$2" webhook=""
  DISCORD_WEBHOOK_SELECTED=""

  if ! ask_yes_no "Enable Discord notifications?" "Y"; then
    return 0
  fi

  while true; do
    echo
    echo -e "${C_CYAN}Paste your Discord webhook.${C_RESET}"
    echo "Your input is hidden so the webhook URL is not shown on screen."
    read -r -s -p "Discord Webhook: " webhook
    echo

    if [[ -z "$webhook" ]]; then
      warn "Webhook is empty."
      if ask_yes_no "Try again?" "Y"; then
        continue
      else
        return 0
      fi
    fi

    if ! valid_webhook_format "$webhook"; then
      warn "The Discord webhook format appears invalid."
      if ask_yes_no "Enter it again?" "Y"; then
        continue
      fi
    fi

    info "Testing the Discord webhook..."
    if test_webhook_direct "$webhook" "$node" "$ip"; then
      ok "Webhook succeeded. Check your Discord channel."
      DISCORD_WEBHOOK_SELECTED="$webhook"
      return 0
    fi

    fail "The webhook did not accept the test."
    if ask_yes_no "Try another webhook?" "Y"; then
      continue
    fi

    if ask_yes_no "Continue installation without Discord?" "N"; then
      return 0
    fi

    die "Installation cancelled."
  done
}

ai_wizard() {
  AI_ENABLED="no"
  GEMINI_API_KEY_SELECTED=""

  echo
  echo -e "${C_BOLD}Optional Gemini AI analyst${C_RESET}"
  echo "AI analysis is advisory only: it never writes nftables rules or changes thresholds automatically."
  if ! ask_yes_no "Enable Gemini attack analysis?" "N"; then
    return 0
  fi

  while true; do
    echo
    echo "Enter the Gemini API key. It will be stored separately with mode 600."
    read -r -s -p "Gemini API key: " GEMINI_API_KEY_SELECTED
    echo
    if [[ -n "$GEMINI_API_KEY_SELECTED" ]]; then
      AI_ENABLED="yes"
      return 0
    fi
    warn "The Gemini API key cannot be empty."
    ask_yes_no "Try again?" "Y" || {
      AI_ENABLED="no"
      return 0
    }
  done
}

choose_profile() {
  echo
  echo -e "${C_BOLD}Choose a protection profile:${C_RESET}"
  echo "  1) Recommended  - suitable for general Minecraft hosting"
  echo "  2) Relaxed      - higher thresholds"
  echo "  3) Strict       - lower thresholds"
  echo "  4) Custom       - configure your own values"
  echo
  read -r -p "Choose [1-4] (default 1): " profile
  profile="${profile:-1}"

  case "$profile" in
    1)
      TCP_SYN_RATE=1500
      TCP_PACKET_RATE=50000
      UDP_PACKET_RATE=20000
      ;;
    2)
      TCP_SYN_RATE=3000
      TCP_PACKET_RATE=100000
      UDP_PACKET_RATE=40000
      ;;
    3)
      TCP_SYN_RATE=750
      TCP_PACKET_RATE=25000
      UDP_PACKET_RATE=10000
      ;;
    4)
      TCP_SYN_RATE="$(ask_value "TCP SYN limit per port /second" "1500")"
      TCP_PACKET_RATE="$(ask_value "TCP packet limit per port /second" "50000")"
      UDP_PACKET_RATE="$(ask_value "UDP packet limit per port /second" "20000")"
      ;;
    *)
      warn "Invalid selection; using Recommended."
      TCP_SYN_RATE=1500
      TCP_PACKET_RATE=50000
      UDP_PACKET_RATE=20000
      ;;
  esac

  TCP_SYN_BURST=$((TCP_SYN_RATE * 2))
  TCP_PACKET_BURST=$((TCP_PACKET_RATE * 2))
  UDP_PACKET_BURST=$((UDP_PACKET_RATE * 2))
}

valid_block_timeout() {
  [[ "$1" =~ ^[0-9]+(s|m|h|d)$ ]] && [[ "${1%[smhd]}" -gt 0 ]]
}

port_wizard() {
  local ufw_status line target base proto
  local -a ranges=()
  local -a selected=()
  local -A seen=()
  local -A protos=()

  TCP_PORT_SET=""
  UDP_PORT_SET=""

  echo
  echo -e "${C_BOLD}Detecting port ranges from UFW...${C_RESET}"

  if ! command -v ufw >/dev/null 2>&1; then
    warn "UFW was not found."
    manual_port_wizard
    return
  fi

  ufw_status="$(ufw status 2>/dev/null || true)"

  if ! grep -q '^Status: active' <<< "$ufw_status"; then
    warn "UFW is not active."
    manual_port_wizard
    return
  fi

  # Read only IPv4 ALLOW IN rules with a numeric port range target.
  # Example:
  # 20000:60000/tcp   ALLOW IN   Anywhere
  # 20000:60000/udp   ALLOW IN   Anywhere
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue

    target="$(awk '{print $1}' <<< "$line")"

    # Ignore IPv6 lines and non-port targets.
    [[ "$line" == *"(v6)"* ]] && continue
    [[ "$target" =~ ^[0-9]+:[0-9]+(/(tcp|udp))?$ ]] || continue

    base="${target%%/*}"
    if [[ "$target" == */tcp ]]; then
      proto="tcp"
    elif [[ "$target" == */udp ]]; then
      proto="udp"
    else
      proto="both"
    fi

    if [[ -z "${seen[$base]:-}" ]]; then
      ranges+=("$base")
      seen["$base"]=1
      protos["$base"]=""
    fi

    case "$proto" in
      tcp)
        [[ "${protos[$base]}" == *tcp* ]] || protos["$base"]="${protos[$base]} tcp"
        ;;
      udp)
        [[ "${protos[$base]}" == *udp* ]] || protos["$base"]="${protos[$base]} udp"
        ;;
      both)
        protos["$base"]=" tcp udp"
        ;;
    esac
  done < <(awk '$2=="ALLOW" && $3=="IN" {print}' <<< "$ufw_status")

  if [[ ${#ranges[@]} -eq 0 ]]; then
    warn "No UFW port-range rule was found, for example 20000:60000/tcp."
    manual_port_wizard
    return
  fi

  echo
  echo "UFW port ranges found:"
  echo

  local i=1 label p
  for base in "${ranges[@]}"; do
    p="${protos[$base]}"
    if [[ "$p" == *tcp* && "$p" == *udp* ]]; then
      label="TCP + UDP"
    elif [[ "$p" == *tcp* ]]; then
      label="TCP"
    elif [[ "$p" == *udp* ]]; then
      label="UDP"
    else
      label="Unknown"
    fi

    printf "  %d) %-17s [%s]\n" "$i" "${base/:/-}" "$label"
    ((i++))
  done

  echo
  echo "  M) Enter a range manually"
  echo
  echo "You can select more than one range, for example: 1,2"
  echo

  local answer
  read -r -p "Select ranges to protect [1]: " answer
  answer="${answer:-1}"

  if [[ "$answer" =~ ^[Mm]$ ]]; then
    manual_port_wizard
    return
  fi

  IFS=',' read -ra selected <<< "$answer"

  local -a tcp_items=()
  local -a udp_items=()
  local idx nft_range

  for idx in "${selected[@]}"; do
    idx="${idx//[[:space:]]/}"

    [[ "$idx" =~ ^[0-9]+$ ]] || die "Selection '$idx' is not a valid number."
    (( idx >= 1 && idx <= ${#ranges[@]} )) || die "Selection '$idx' is outside the list."

    base="${ranges[$((idx-1))]}"
    nft_range="${base/:/-}"
    p="${protos[$base]}"

    if [[ "$p" == *tcp* ]]; then
      tcp_items+=("$nft_range")
    fi
    if [[ "$p" == *udp* ]]; then
      udp_items+=("$nft_range")
    fi
  done

  if [[ ${#tcp_items[@]} -gt 0 ]]; then
    TCP_PORT_SET="{ $(IFS=', '; echo "${tcp_items[*]}") }"
  fi

  if [[ ${#udp_items[@]} -gt 0 ]]; then
    UDP_PORT_SET="{ $(IFS=', '; echo "${udp_items[*]}") }"
  fi

  [[ -n "$TCP_PORT_SET" || -n "$UDP_PORT_SET" ]] || die "No protocol or range was selected."

  echo
  ok "Protection ranges selected from UFW."
  [[ -n "$TCP_PORT_SET" ]] && echo "  TCP : $TCP_PORT_SET"
  [[ -n "$UDP_PORT_SET" ]] && echo "  UDP : $UDP_PORT_SET"
}

manual_port_wizard() {
  local tcp_range udp_range default_tcp_set default_udp_set

  default_tcp_set='{ 20000-60000 }'
  default_udp_set='{ 20000-60000 }'

  echo
  echo -e "${C_YELLOW}Manual mode${C_RESET}"
  echo "Use nftables set format, for example:"
  echo "  { 25565-30000 }"
  echo "  { 19132, 20000-60000 }"
  echo
  echo "Enter '-' to leave a protocol unprotected."
  echo

  read -r -p "TCP port set [$default_tcp_set]: " tcp_range
  read -r -p "UDP port set [$default_udp_set]: " udp_range

  tcp_range="${tcp_range:-$default_tcp_set}"
  udp_range="${udp_range:-$default_udp_set}"

  [[ "$tcp_range" == "-" ]] && TCP_PORT_SET="" || TCP_PORT_SET="$tcp_range"
  [[ "$udp_range" == "-" ]] && UDP_PORT_SET="" || UDP_PORT_SET="$udp_range"

  [[ -n "$TCP_PORT_SET" || -n "$UDP_PORT_SET" ]] || die "TCP and UDP cannot both be disabled."
}

write_config() {
  local wan="$1" public_ip="$2" webhook="$3"

  cat > "$CONF" <<EOF
WAN="$wan"
PUBLIC_IP="$public_ip"
DISCORD_WEBHOOK="$webhook"

TCP_SYN_RATE="$TCP_SYN_RATE"
TCP_SYN_BURST="$TCP_SYN_BURST"

TCP_PACKET_RATE="$TCP_PACKET_RATE"
TCP_PACKET_BURST="$TCP_PACKET_BURST"

UDP_PACKET_RATE="$UDP_PACKET_RATE"
UDP_PACKET_BURST="$UDP_PACKET_BURST"

TCP_PORT_SET='$TCP_PORT_SET'
UDP_PORT_SET='$UDP_PORT_SET'
AUTO_BLOCK_TIMEOUT='$AUTO_BLOCK_TIMEOUT'
ALLOWLIST_FILE='$ALLOWLIST'
BLOCKLIST_FILE='$BLOCKLIST'
AI_ENABLED='$AI_ENABLED'
AI_MODEL='$AI_MODEL'
AI_INTERVAL_SECONDS='$AI_INTERVAL_SECONDS'
GEMINI_API_KEY_FILE='$AI_KEY_FILE'
EOF

  chmod 600 "$CONF"
  touch "$ALLOWLIST" "$BLOCKLIST"
  chmod 600 "$ALLOWLIST" "$BLOCKLIST"
  if [[ ! -s "$ALLOWLIST" ]]; then
    printf '%s\n' '# One IPv4 address or CIDR per line. Allowlist wins over every block.' > "$ALLOWLIST"
  fi
  if [[ ! -s "$BLOCKLIST" ]]; then
    printf '%s\n' '# One IPv4 address or CIDR per line. Entries are blocked at WAN ingress.' > "$BLOCKLIST"
  fi
  if [[ "$AI_ENABLED" == "yes" && -n "$GEMINI_API_KEY_SELECTED" ]]; then
    printf '%s\n' "$GEMINI_API_KEY_SELECTED" > "$AI_KEY_FILE"
    chmod 600 "$AI_KEY_FILE"
  else
    rm -f "$AI_KEY_FILE"
  fi
  ok "Configuration saved: $CONF"
  ok "IP override files saved: $ALLOWLIST and $BLOCKLIST"
}

write_guard() {
cat > "$BIN" <<'GUARD'
#!/usr/bin/env bash
set -Eeuo pipefail

CONF="/etc/ptero-guard.conf"
STATE_DIR="/run/ptero-guard"
TABLE="ptero_detect"

[[ -r "$CONF" ]] || { echo "Configuration $CONF was not found."; exit 1; }
# shellcheck disable=SC1091
source "$CONF"

mkdir -p "$STATE_DIR"
ALLOWLIST_FILE="${ALLOWLIST_FILE:-/etc/ptero-guard-allowlist}"
BLOCKLIST_FILE="${BLOCKLIST_FILE:-/etc/ptero-guard-blocklist}"
AUTO_BLOCK_TIMEOUT="${AUTO_BLOCK_TIMEOUT:-30m}"
AI_ENABLED="${AI_ENABLED:-no}"
AI_MODEL="${AI_MODEL:-gemini-2.5-flash}"
AI_INTERVAL_SECONDS="${AI_INTERVAL_SECONDS:-60}"
GEMINI_API_KEY_FILE="${GEMINI_API_KEY_FILE:-/etc/ptero-guard-gemini.key}"
AI_STATE_FILE="$STATE_DIR/ai.last"

[[ "$AUTO_BLOCK_TIMEOUT" =~ ^[0-9]+(s|m|h|d)$ ]] || {
  logger -t ptero-guard "Invalid AUTO_BLOCK_TIMEOUT; using 30m"
  AUTO_BLOCK_TIMEOUT="30m"
}
touch "$ALLOWLIST_FILE" "$BLOCKLIST_FILE"
chmod 600 "$ALLOWLIST_FILE" "$BLOCKLIST_FILE"

HOSTNAME_NOW="$(hostname)"

if [[ -z "${PUBLIC_IP:-}" ]]; then
  PUBLIC_IP="$(ip -4 -o addr show dev "$WAN" scope global |
    awk 'NR==1 {split($4,a,"/"); print a[1]}')"
fi

read_override_elements() {
  local file="$1"
  [[ -r "$file" ]] || return 0

  awk '
    function valid_octet(x) { return x ~ /^[0-9]+$/ && x >= 0 && x <= 255 }
    {
      sub(/#.*/, "")
      gsub(/^[ \t]+|[ \t]+$/, "")
      if ($0 == "" || $0 ~ /[ \t]/) next
      split($0, cidr, "/")
      if (split(cidr[1], octets, ".") != 4) next
      good = 1
      for (i = 1; i <= 4; i++) if (!valid_octet(octets[i])) good = 0
      if (length(cidr[2]) && (cidr[2] !~ /^[0-9]+$/ || cidr[2] > 32)) good = 0
      if (!good) next
      if (out != "") out = out ", "
      out = out $0
    }
    END { print out }
  ' "$file"
}

generate_rules() {
  local allow_elements block_elements
  allow_elements="$(read_override_elements "$ALLOWLIST_FILE")"
  block_elements="$(read_override_elements "$BLOCKLIST_FILE")"

  cat <<NFT
destroy table netdev $TABLE

table netdev $TABLE {
    set manual_allow {
        type ipv4_addr
        flags interval
NFT
  [[ -n "$allow_elements" ]] && echo "        elements = { $allow_elements }"
  cat <<NFT
    }

    set manual_block {
        type ipv4_addr
        flags interval
NFT
  [[ -n "$block_elements" ]] && echo "        elements = { $block_elements }"
  cat <<NFT
    }

    set blocked_ips {
        type ipv4_addr
        flags dynamic,timeout
        timeout $AUTO_BLOCK_TIMEOUT
        size 65535
    }

    set blocked_counters {
        type ipv4_addr
        flags dynamic,timeout
        timeout $AUTO_BLOCK_TIMEOUT
        size 65535
    }

    set attack_tcp_syn {
        type ipv4_addr . inet_service
        flags dynamic,timeout
        timeout $AUTO_BLOCK_TIMEOUT
        size 65535
    }

    set attack_tcp_packet {
        type ipv4_addr . inet_service
        flags dynamic,timeout
        timeout $AUTO_BLOCK_TIMEOUT
        size 65535
    }

    set attack_udp {
        type ipv4_addr . inet_service
        flags dynamic,timeout
        timeout $AUTO_BLOCK_TIMEOUT
        size 65535
    }

    set tcp_syn_rate {
        type inet_service
        flags dynamic,timeout
        timeout 10s
        size 65535
    }

    set tcp_packet_rate {
        type inet_service
        flags dynamic,timeout
        timeout 10s
        size 65535
    }

    set udp_rate {
        type inet_service
        flags dynamic,timeout
        timeout 10s
        size 65535
    }

    set attacked_tcp_syn {
        type inet_service
        flags dynamic,timeout
        timeout 60s
        size 65535
    }

    set attacked_tcp_packet {
        type inet_service
        flags dynamic,timeout
        timeout 60s
        size 65535
    }

    set attacked_udp {
        type inet_service
        flags dynamic,timeout
        timeout 60s
        size 65535
    }

    chain ingress {
        type filter hook ingress device "$WAN" priority -500;
        policy accept;
        ip saddr @manual_allow return
        ip saddr @manual_block counter drop
        ip saddr @blocked_ips add @blocked_counters { ip saddr counter }
        ip saddr @blocked_ips ip saddr @blocked_counters drop
        ip saddr @blocked_ips counter drop
NFT

  if [[ -n "${TCP_PORT_SET:-}" ]]; then
    echo "        tcp dport $TCP_PORT_SET tcp flags & (fin|syn|rst|ack) == syn meter ptero_syn_source { ip saddr . tcp dport limit rate over $TCP_SYN_RATE/second burst $TCP_SYN_BURST packets } add @blocked_ips { ip saddr timeout $AUTO_BLOCK_TIMEOUT } add @blocked_counters { ip saddr counter timeout $AUTO_BLOCK_TIMEOUT } add @attack_tcp_syn { ip saddr . tcp dport timeout $AUTO_BLOCK_TIMEOUT } counter drop"
    echo
    echo "        tcp dport $TCP_PORT_SET meter ptero_packet_source { ip saddr . tcp dport limit rate over $TCP_PACKET_RATE/second burst $TCP_PACKET_BURST packets } add @blocked_ips { ip saddr timeout $AUTO_BLOCK_TIMEOUT } add @blocked_counters { ip saddr counter timeout $AUTO_BLOCK_TIMEOUT } add @attack_tcp_packet { ip saddr . tcp dport timeout $AUTO_BLOCK_TIMEOUT } counter drop"
    echo
    echo "        tcp dport $TCP_PORT_SET tcp flags & (fin|syn|rst|ack) == syn update @tcp_syn_rate { tcp dport limit rate over $TCP_SYN_RATE/second burst $TCP_SYN_BURST packets } update @attacked_tcp_syn { tcp dport timeout 60s } counter drop"
    echo
    echo "        tcp dport $TCP_PORT_SET update @tcp_packet_rate { tcp dport limit rate over $TCP_PACKET_RATE/second burst $TCP_PACKET_BURST packets } update @attacked_tcp_packet { tcp dport timeout 60s } counter drop"
  fi

  if [[ -n "${UDP_PORT_SET:-}" ]]; then
    echo
    echo "        udp dport $UDP_PORT_SET meter ptero_udp_source { ip saddr . udp dport limit rate over $UDP_PACKET_RATE/second burst $UDP_PACKET_BURST packets } add @blocked_ips { ip saddr timeout $AUTO_BLOCK_TIMEOUT } add @blocked_counters { ip saddr counter timeout $AUTO_BLOCK_TIMEOUT } add @attack_udp { ip saddr . udp dport timeout $AUTO_BLOCK_TIMEOUT } counter drop"
    echo
    echo "        udp dport $UDP_PORT_SET update @udp_rate { udp dport limit rate over $UDP_PACKET_RATE/second burst $UDP_PACKET_BURST packets } update @attacked_udp { udp dport timeout 60s } counter drop"
  fi

cat <<'NFT'
    }
}
NFT
}

apply_firewall() {
  local tmp
  tmp="$(mktemp)"
  generate_rules > "$tmp"

  if ! nft -c -f "$tmp"; then
    rm -f "$tmp"
    logger -t ptero-guard "nftables syntax validation failed"
    return 1
  fi

  nft -f "$tmp"
  rm -f "$tmp"
  logger -t ptero-guard "Per-port protection loaded on $WAN"
}

ensure_firewall() {
  nft list table netdev "$TABLE" >/dev/null 2>&1 || apply_firewall
}

get_ports() {
  local set_name="$1"

  nft -j list set netdev "$TABLE" "$set_name" 2>/dev/null |
  jq -r '
    .nftables[]?
    | select(.set != null)
    | .set.elem[]?
    | if type == "number" then .
      elif type == "object" and has("elem") then
        if (.elem|type) == "number" then .elem
        elif (.elem|type) == "object" then (.elem.val // empty)
        else empty end
      elif type == "object" and has("val") then .val
      else empty end
  ' |
  grep -E '^[0-9]+$' |
  sort -n -u || true
}

get_set_rows() {
  local set_name="$1"
  nft -j list set netdev "$TABLE" "$set_name" 2>/dev/null |
    jq -r '
      def key:
        if type == "array" then map(key) | join("|")
        elif type == "object" then ((.val // .elem // .key // "") | key)
        else tostring
        end;
      .nftables[]?.set.elem[]? |
      (if type == "object" then . else {elem:.} end) as $e |
      (($e.elem // $e.val // $e.key // "") | key) as $key |
      [$key, ($e.expires // ""), ($e.counter.packets // 0), ($e.counter.bytes // 0)] |
      @tsv
    ' || true
}

block_timeout_seconds() {
  local value="${AUTO_BLOCK_TIMEOUT%[smhd]}"
  case "${AUTO_BLOCK_TIMEOUT: -1}" in
    s) echo "$value" ;;
    m) echo $((value * 60)) ;;
    h) echo $((value * 3600)) ;;
    d) echo $((value * 86400)) ;;
    *) echo 1800 ;;
  esac
}

reverse_dns() {
  local ip="$1" name
  name="$(timeout 2 getent hosts "$ip" 2>/dev/null | awk 'NR==1 {print $2}' || true)"
  printf '%s' "${name:-No PTR record resolved}"
}

state_row() {
  local ip="$1"
  awk -F '\t' -v ip="$ip" '$1 == ip { line=$0 } END { if (line != "") print line }' \
    "$STATE_DIR/blocks.tsv" 2>/dev/null || true
}

write_state_row() {
  local ip="$1" proto="$2" attack="$3" port="$4" threshold="$5"
  local started="$6" last_seen="$7" expires="$8" last_packets="$9" peak="${10}" alerted="${11}"
  local tmp="$STATE_DIR/blocks.tsv.tmp"
  awk -F '\t' -v OFS='\t' -v ip="$ip" '$1 != ip { print }' \
    "$STATE_DIR/blocks.tsv" 2>/dev/null > "$tmp" || true
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$ip" "$proto" "$attack" "$port" "$threshold" "$started" "$last_seen" \
    "$expires" "$last_packets" "$peak" "$alerted" >> "$tmp"
  mv -f "$tmp" "$STATE_DIR/blocks.tsv"
}

send_attack() {
  local ip="$1" proto="$2" port="$3" attack_type="$4" threshold="$5"
  local peak="$6" action="$7" payload reverse
  reverse="$(reverse_dns "$ip")"

  payload="$(jq -n \
    --arg node "$HOSTNAME_NOW" \
    --arg public_ip "$PUBLIC_IP" \
    --arg source "$ip" \
    --arg rdns "$reverse" \
    --arg proto "$proto" \
    --arg port "$port" \
    --arg attack "$attack_type" \
    --arg peak "$peak" \
    --arg threshold "$threshold" \
    --arg action "$action" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"🚨 Per-Source Flood Attack Detected",
        description:"A source IP exceeded the configured per-port threshold and was blocked at WAN ingress.",
        color:15158332,
        fields:[
          {name:"Node Hostname",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$public_ip+"`"),inline:true},
          {name:"Attacking Source IP",value:("`"+$source+"`"),inline:true},
          {name:"Reverse DNS",value:$rdns,inline:false},
          {name:"Target Port / Protocol",value:("`"+$port+" / "+$proto+"`"),inline:true},
          {name:"Attack Type",value:$attack,inline:true},
          {name:"Peak Packets/sec Observed",value:$peak,inline:true},
          {name:"Exceeded Threshold",value:$threshold,inline:true},
          {name:"Action Taken",value:$action,inline:false}
        ],
        footer:{text:"Pterodactyl Flood Guard · nftables netdev ingress"},
        timestamp:(now|todateiso8601)
      }]
    }')"

  discord_post "$payload"
  logger -t ptero-guard "ATTACK source=$ip $proto/$port type=$attack_type peak=$peak"
}

send_recovered() {
  local ip="$1" proto="$2" port="$3" attack_type="$4" duration="$5"
  local dropped="$6" reason="$7" payload

  payload="$(jq -n \
    --arg node "$HOSTNAME_NOW" \
    --arg public_ip "$PUBLIC_IP" \
    --arg source "$ip" \
    --arg proto "$proto" \
    --arg port "$port" \
    --arg attack "$attack_type" \
    --arg duration "$duration" \
    --arg dropped "$dropped" \
    --arg reason "$reason" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"✅ Source IP Unblocked",
        description:"The temporary source-IP block is no longer active.",
        color:3066993,
        fields:[
          {name:"Node Hostname",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$public_ip+"`"),inline:true},
          {name:"Attacking Source IP",value:("`"+$source+"`"),inline:true},
          {name:"Target Port / Protocol",value:("`"+$port+" / "+$proto+"`"),inline:true},
          {name:"Attack Type",value:$attack,inline:true},
          {name:"Blocked For",value:$duration,inline:true},
          {name:"Dropped Packets During Block",value:$dropped,inline:true},
          {name:"Recovery",value:$reason,inline:false}
        ],
        footer:{text:"Pterodactyl Flood Guard · automatic expiry"},
        timestamp:(now|todateiso8601)
      }]
    }')"

  discord_post "$payload"
  logger -t ptero-guard "RECOVERED source=$ip reason=$reason dropped=$dropped"
}

format_duration() {
  local seconds="$1"
  (( seconds < 0 )) && seconds=0
  if (( seconds >= 86400 )); then
    printf '%dd %dh' "$((seconds / 86400))" "$(((seconds % 86400) / 3600))"
  elif (( seconds >= 3600 )); then
    printf '%dh %dm' "$((seconds / 3600))" "$(((seconds % 3600) / 60))"
  else
    printf '%dm %ds' "$((seconds / 60))" "$((seconds % 60))"
  fi
}

process_attack_set() {
  local set_name="$1" proto="$2" attack="$3" threshold="$4"
  local row key expires packets bytes ip port now expiry current
  now="$(date +%s)"
  while IFS=$'\t' read -r key expires packets bytes; do
    [[ -n "$key" ]] || continue
    ip="${key%%|*}"
    port="${key#*|}"
    [[ "$ip" != "$key" ]] || port="unknown"
    current="$(state_row "$ip")"
    if [[ -z "$current" ]]; then
      expiry=$((now + $(block_timeout_seconds)))
      write_state_row "$ip" "$proto" "$attack" "$port" "$threshold" "$now" "$now" \
        "$expiry" "${packets:-0}" "0" "0"
      logger -t ptero-guard "New source block observed for $ip on $proto/$port"
    fi
  done < <(get_set_rows "$set_name")
}

refresh_block_counters() {
  local row key expires packets bytes ip current now started last_seen expiry last_packets peak alerted
  local elapsed delta rate
  now="$(date +%s)"
  while IFS=$'\t' read -r key expires packets bytes; do
    [[ -n "$key" ]] || continue
    ip="$key"
    current="$(state_row "$ip")"
    [[ -n "$current" ]] || continue
    IFS=$'\t' read -r _ proto attack port threshold started last_seen expiry last_packets peak alerted <<< "$current"
    elapsed=$((now - last_seen))
    (( elapsed < 1 )) && elapsed=1
    delta=$(( ${packets:-0} - ${last_packets:-0} ))
    (( delta < 0 )) && delta=0
    rate=$((delta / elapsed))
    (( rate > peak )) && peak="$rate"
    if [[ "$alerted" == "0" ]]; then
      (( peak < threshold )) && peak="$((threshold + 1))"
      send_attack "$ip" "$proto" "$port" "$attack" "> ${threshold} packets/sec" \
        "${peak} packets/sec (nftables counter sample)" \
        "IP blocked globally for ${AUTO_BLOCK_TIMEOUT} at netdev ingress"
      alerted=1
    fi
    write_state_row "$ip" "$proto" "$attack" "$port" "$threshold" "$started" "$now" \
      "$expiry" "${packets:-0}" "$peak" "$alerted"
  done < <(get_set_rows blocked_counters)
}

expire_blocks() {
  local current row ip proto attack port threshold started last_seen expiry last_packets peak alerted
  local now duration snapshot
  now="$(date +%s)"
  snapshot="$STATE_DIR/blocks.snapshot"
  cp "$STATE_DIR/blocks.tsv" "$snapshot"
  while IFS=$'\t' read -r ip proto attack port threshold started last_seen expiry last_packets peak alerted; do
    [[ -n "$ip" ]] || continue
    current="$(get_set_rows blocked_ips | awk -F '\t' -v ip="$ip" '$1 == ip { print; exit }')"
    [[ -n "$current" ]] && continue
    duration="$(format_duration "$((now - started))")"
    send_recovered "$ip" "$proto" "$port" "$attack" "$duration" \
      "${last_packets:-0}" "Automatic ${AUTO_BLOCK_TIMEOUT} timeout expired"
    sed -i "\|^${ip}[	]|d" "$STATE_DIR/blocks.tsv"
  done < "$snapshot"
  rm -f "$snapshot"
}

discord_post() {
  local payload="$1"

  [[ -n "${DISCORD_WEBHOOK:-}" ]] || return 0

  curl --silent --show-error --fail --max-time 10 \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$payload" \
    "$DISCORD_WEBHOOK" >/dev/null ||
  logger -t ptero-guard "Discord webhook failed"
}

send_ai_assessment() {
  local severity="$1" assessment="$2" recommendations="$3" model="$4" payload
  [[ -n "${DISCORD_WEBHOOK:-}" ]] || return 0

  payload="$(jq -n \
    --arg node "$HOSTNAME_NOW" \
    --arg ip "$PUBLIC_IP" \
    --arg severity "$severity" \
    --arg assessment "$assessment" \
    --arg recommendations "$recommendations" \
    --arg model "$model" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"🧠 Gemini DDoS Analysis",
        description:$assessment,
        color:(if $severity == "critical" then 15158332
          elif $severity == "high" then 16744192
          elif $severity == "medium" then 16776960
          else 3066993 end),
        fields:[
          {name:"Node",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$ip+"`"),inline:true},
          {name:"Severity",value:$severity,inline:true},
          {name:"Recommendations",value:$recommendations,inline:false},
          {name:"Decision Mode",value:"Advisory only; nftables remains authoritative.",inline:false},
          {name:"Model",value:$model,inline:true}
        ],
        footer:{text:"Pterodactyl Flood Guard · Gemini analyst"},
        timestamp:(now|todateiso8601)
      }]
    }')"

  discord_post "$payload"
}

ai_analyze() {
  local now last telemetry prompt payload response text severity assessment recommendations
  [[ "$AI_ENABLED" == "yes" ]] || return 0
  [[ -r "$GEMINI_API_KEY_FILE" ]] || {
    logger -t ptero-guard "Gemini enabled but key file is missing: $GEMINI_API_KEY_FILE"
    return 0
  }

  now="$(date +%s)"
  last=0
  [[ -r "$AI_STATE_FILE" ]] && read -r last < "$AI_STATE_FILE" || true
  [[ "$last" =~ ^[0-9]+$ ]] || last=0
  (( now - last >= AI_INTERVAL_SECONDS )) || return 0
  printf '%s\n' "$now" > "$AI_STATE_FILE"

  telemetry="$(
    awk -F '\t' '
      BEGIN { OFS=" | " }
      NF >= 11 {
        print "source=" $1, "protocol=" $2, "attack=" $3, "port=" $4,
          "threshold=" $5, "started_epoch=" $6, "dropped_packets=" $9,
          "peak_pps=" $10
      }
    ' "$STATE_DIR/blocks.tsv" 2>/dev/null | head -25
  )"
  [[ -n "$telemetry" ]] || telemetry="No active automatic source blocks were recorded in this interval."

  prompt="$(cat <<EOF
You are the defensive analyst for a Pterodactyl Wings node.
Analyze only the supplied firewall telemetry. Do not invent IPs, rates, ports, or events.
Return strict JSON with exactly these string fields:
severity (low, medium, high, or critical),
assessment (one concise paragraph),
recommendations (a concise newline-separated list).
Do not instruct the operator to disable the firewall, expose SSH, or run destructive commands.
This system is advisory-only: do not claim that you changed nftables rules.

Node hostname: $HOSTNAME_NOW
Node public IPv4: $PUBLIC_IP
Configured auto-block timeout: $AUTO_BLOCK_TIMEOUT
Telemetry:
$telemetry
EOF
)"

  payload="$(jq -n \
    --arg model "$AI_MODEL" \
    --arg prompt "$prompt" \
    '{
      contents:[{role:"user",parts:[{text:$prompt}]}],
      generationConfig:{
        temperature:0.2,
        maxOutputTokens:800,
        responseMimeType:"application/json"
      }
    }')"

  response="$(
    curl --silent --show-error --fail --max-time 25 \
      -H "Content-Type: application/json" \
      -H "x-goog-api-key: $(cat "$GEMINI_API_KEY_FILE")" \
      -X POST \
      -d "$payload" \
      "https://generativelanguage.googleapis.com/v1beta/models/${AI_MODEL}:generateContent" \
      2>/dev/null
  )" || {
    logger -t ptero-guard "Gemini analysis request failed"
    return 0
  }

  text="$(jq -r '.candidates[0].content.parts | map(.text // "") | join("")' <<< "$response" 2>/dev/null || true)"
  [[ -n "$text" && "$text" != "null" ]] || {
    logger -t ptero-guard "Gemini response contained no analysis"
    return 0
  }

  severity="$(jq -r '.severity // "medium"' <<< "$text" 2>/dev/null || true)"
  assessment="$(jq -r '.assessment // empty' <<< "$text" 2>/dev/null || true)"
  recommendations="$(jq -r '.recommendations // empty' <<< "$text" 2>/dev/null || true)"
  [[ "$severity" =~ ^(low|medium|high|critical)$ ]] || severity="medium"
  [[ -n "$assessment" ]] || assessment="Gemini returned an unstructured assessment: ${text:0:900}"
  [[ -n "$recommendations" ]] || recommendations="No structured recommendation was returned."
  send_ai_assessment "$severity" "$assessment" "$recommendations" "$AI_MODEL"
  logger -t ptero-guard "Gemini analysis completed severity=$severity"
}

send_port_attack() {
  local proto="$1" port="$2" attack_type="$3" threshold="$4" payload

  payload="$(jq -n \
    --arg node "$HOSTNAME_NOW" \
    --arg ip "$PUBLIC_IP" \
    --arg proto "$proto" \
    --arg port "$port" \
    --arg attack "$attack_type" \
    --arg threshold "$threshold" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"🚨 Flood Attack Detected",
        description:"Per-port mitigation is actively dropping excess traffic.",
        color:15158332,
        fields:[
          {name:"Node",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$ip+"`"),inline:true},
          {name:"Target",value:("`"+$proto+"/"+$port+"`"),inline:true},
          {name:"Attack Type",value:$attack,inline:true},
          {name:"Threshold",value:$threshold,inline:true},
          {name:"Action",value:"Excess traffic is dropped only for this destination port.",inline:false}
        ],
        footer:{text:"Pterodactyl Per-Port Flood Protection"},
        timestamp:(now|todateiso8601)
      }]
    }')"

  discord_post "$payload"
  logger -t ptero-guard "ATTACK $proto/$port type=$attack_type"
}

send_port_recovered() {
  local proto="$1" port="$2" attack_type="$3" payload

  payload="$(jq -n \
    --arg node "$HOSTNAME_NOW" \
    --arg ip "$PUBLIC_IP" \
    --arg proto "$proto" \
    --arg port "$port" \
    --arg attack "$attack_type" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"✅ Attack Mitigated",
        description:"Traffic has returned below the configured threshold.",
        color:3066993,
        fields:[
          {name:"Node",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$ip+"`"),inline:true},
          {name:"Target",value:("`"+$proto+"/"+$port+"`"),inline:true},
          {name:"Attack Type",value:$attack,inline:true},
          {name:"Status",value:"Normal",inline:true}
        ],
        footer:{text:"Pterodactyl Per-Port Flood Protection"},
        timestamp:(now|todateiso8601)
      }]
    }')"

  discord_post "$payload"
  logger -t ptero-guard "RECOVERED $proto/$port type=$attack_type"
}

check_attack_set() {
  local set_name="$1" proto="$2" attack_type="$3" threshold="$4"
  local current="$STATE_DIR/${set_name}.current"
  local previous="$STATE_DIR/${set_name}.previous"

  get_ports "$set_name" > "$current"
  touch "$previous"

  sort -n -u -o "$current" "$current"
  sort -n -u -o "$previous" "$previous"

  comm -13 "$previous" "$current" |
  while read -r port; do
    [[ -n "$port" ]] && send_port_attack "$proto" "$port" "$attack_type" "$threshold"
  done

  comm -23 "$previous" "$current" |
  while read -r port; do
    [[ -n "$port" ]] && send_port_recovered "$proto" "$port" "$attack_type"
  done

  cp "$current" "$previous"
}

monitor() {
  ensure_firewall
  touch "$STATE_DIR/blocks.tsv"
  logger -t ptero-guard "Ptero Guard started on $WAN ($PUBLIC_IP)"

  while true; do
    if nft list table netdev "$TABLE" >/dev/null 2>&1; then
      process_attack_set attack_tcp_syn TCP "TCP SYN Flood" "$TCP_SYN_RATE"
      process_attack_set attack_tcp_packet TCP "TCP Packet Flood" "$TCP_PACKET_RATE"
      process_attack_set attack_udp UDP "UDP Flood" "$UDP_PACKET_RATE"
      refresh_block_counters
      expire_blocks
      ai_analyze
      check_attack_set attacked_tcp_syn TCP "TCP SYN Flood" "> ${TCP_SYN_RATE} SYN/s"
      check_attack_set attacked_tcp_packet TCP "TCP Packet Flood" "> ${TCP_PACKET_RATE} packets/s"
      check_attack_set attacked_udp UDP "UDP Packet Flood" "> ${UDP_PACKET_RATE} packets/s"
    else
      logger -t ptero-guard "Firewall table missing; restoring"
      apply_firewall
    fi
    sleep 2
  done
}

is_ipv4() {
  local ip="$1" octet
  [[ "$ip" =~ ^[0-9]+(\.[0-9]+){3}$ ]] || return 1
  IFS='.' read -r -a octets <<< "$ip"
  for octet in "${octets[@]}"; do
    (( octet <= 255 )) || return 1
  done
}

blocklist_guard() {
  local key expires packets bytes ip row proto attack port threshold started last_seen expiry last_packets peak alerted
  echo "========================================"
  echo " PTERO GUARD ACTIVE BLOCKLIST"
  echo "========================================"
  printf '%-18s %-22s %-10s %-18s %s\n' "IP" "Reason" "Target" "Expiry" "Dropped"
  while IFS=$'\t' read -r key expires packets bytes; do
    [[ -n "$key" ]] || continue
    ip="$key"
    row="$(state_row "$ip")"
    if [[ -n "$row" ]]; then
      IFS=$'\t' read -r _ proto attack port threshold started last_seen expiry last_packets peak alerted <<< "$row"
      printf '%-18s %-22s %-10s %-18s %s\n' "$ip" "$attack" "$proto/$port" \
        "in $(format_duration "${expires:-0}")" "${last_packets:-0}"
    else
      printf '%-18s %-22s %-10s %-18s %s\n' "$ip" "Automatic block" "unknown" \
        "in $(format_duration "${expires:-0}")" "0"
    fi
  done < <(get_set_rows blocked_ips)

  echo
  echo "Permanent allowlist:"
  read_override_elements "$ALLOWLIST_FILE" | tr ',' '\n' | sed '/^[[:space:]]*$/d' | sed 's/^/  /'
  echo "Permanent blocklist:"
  read_override_elements "$BLOCKLIST_FILE" | tr ',' '\n' | sed '/^[[:space:]]*$/d' | sed 's/^/  /'
}

unblock_ip() {
  local ip="$1" row proto attack port threshold started last_seen expiry last_packets peak alerted
  [[ ${EUID:-$(id -u)} -eq 0 ]] || { echo "Run unblock as root." >&2; exit 1; }
  is_ipv4 "$ip" || { echo "Invalid IPv4 address: $ip" >&2; exit 1; }

  row="$(state_row "$ip")"
  if [[ -n "$row" ]]; then
    IFS=$'\t' read -r _ proto attack port threshold started last_seen expiry last_packets peak alerted <<< "$row"
  fi

  nft delete element netdev "$TABLE" blocked_ips "{ $ip }" 2>/dev/null || true
  nft delete element netdev "$TABLE" blocked_counters "{ $ip }" 2>/dev/null || true
  for source_set in attack_tcp_syn attack_tcp_packet attack_udp; do
    while IFS=$'\t' read -r key _; do
      [[ "${key%%|*}" == "$ip" ]] || continue
      nft delete element netdev "$TABLE" "$source_set" "{ ${key%%|*} . ${key#*|} }" 2>/dev/null || true
    done < <(get_set_rows "$source_set")
  done

  if [[ -n "$row" ]]; then
    send_recovered "$ip" "${proto:-unknown}" "${port:-unknown}" "${attack:-Source flood}" \
      "$(format_duration "$(($(date +%s) - started))")" "${last_packets:-0}" \
      "Manual early unblock requested"
    sed -i "\|^${ip}[	]|d" "$STATE_DIR/blocks.tsv"
  fi
  echo "Unblocked $ip. It will be re-blocked if it exceeds a protected-port threshold again."
}

test_webhook() {
  [[ -n "${DISCORD_WEBHOOK:-}" ]] || {
  echo "Discord notifications are not configured."
    exit 1
  }

  local payload

  payload="$(jq -n \
    --arg node "$HOSTNAME_NOW" \
    --arg ip "$PUBLIC_IP" \
    '{
      username:"Pterodactyl Flood Guard",
      embeds:[{
        title:"✅ Flood Guard Online",
        description:"Firewall protection and Discord notifications are active.",
        color:3066993,
        fields:[
          {name:"Node",value:("`"+$node+"`"),inline:true},
          {name:"Public IP",value:("`"+$ip+"`"),inline:true},
          {name:"Protection",value:"Per Destination Port",inline:true}
        ],
        footer:{text:"Pterodactyl Per-Port Flood Protection"},
        timestamp:(now|todateiso8601)
      }]
    }')"

  discord_post "$payload"
  echo "Webhook test sent."
}

status_guard() {
  echo "========================================"
  echo " PTERODACTYL FLOOD GUARD"
  echo "========================================"
  echo "Node : $HOSTNAME_NOW"
  echo "WAN  : $WAN"
  echo "IP   : $PUBLIC_IP"
  echo
  echo "TCP SYN     : $TCP_SYN_RATE/s"
  echo "TCP packets : $TCP_PACKET_RATE/s"
  echo "UDP packets : $UDP_PACKET_RATE/s"
  echo "TCP Ports   : ${TCP_PORT_SET:-Disabled}"
  echo "UDP Ports   : ${UDP_PORT_SET:-Disabled}"
  echo "Auto-block  : $AUTO_BLOCK_TIMEOUT"
  echo "Gemini AI   : $([[ "$AI_ENABLED" == "yes" ]] && echo Enabled || echo Disabled) ($AI_MODEL)"
  echo "Discord     : $([[ -n "${DISCORD_WEBHOOK:-}" ]] && echo Enabled || echo Disabled)"
  echo
  echo "[ACTIVE SOURCE BLOCKS]"
  nft list set netdev "$TABLE" blocked_ips 2>/dev/null || true
  echo
  echo "[TCP SYN ATTACK]"
  nft list set netdev "$TABLE" attacked_tcp_syn 2>/dev/null || true
  echo
  echo "[TCP PACKET ATTACK]"
  nft list set netdev "$TABLE" attacked_tcp_packet 2>/dev/null || true
  echo
  echo "[UDP ATTACK]"
  nft list set netdev "$TABLE" attacked_udp 2>/dev/null || true
  echo
  echo "[DROP COUNTERS]"
  nft list chain netdev "$TABLE" ingress 2>/dev/null || true
}

case "${1:-monitor}" in
  monitor) monitor ;;
  apply) apply_firewall ;;
  test) test_webhook ;;
  status) status_guard ;;
  blocklist) blocklist_guard ;;
  unblock)
    [[ $# -eq 2 ]] || { echo "Usage: ptero-guard unblock <ipv4>"; exit 1; }
    unblock_ip "$2"
    ;;
  *) echo "Usage: ptero-guard {monitor|apply|test|status|blocklist|unblock <ipv4>}"; exit 1 ;;
esac
GUARD

  chmod 700 "$BIN"
  bash -n "$BIN"
  ok "Ptero Guard binary created."
}

write_service() {
cat > "$SERVICE" <<'EOF'
[Unit]
Description=Pterodactyl Per-Port Flood Guard + Discord Notifications
After=network-online.target docker.service
Wants=network-online.target
Requires=docker.service

[Service]
Type=simple
ExecStart=/usr/local/sbin/ptero-guard monitor
Restart=always
RestartSec=3
User=root
RuntimeDirectory=ptero-guard
RuntimeDirectoryMode=0700

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  ok "Systemd service created."
}

install_guard() {
  require_root
  detect_os

  clear || true
  echo -e "${C_BOLD}========================================"
  echo "       PTERO GUARD SETUP WIZARD"
  echo -e "========================================${C_RESET}"
  echo "Version $VERSION"
  echo

  install_deps

  local wan detected_ip input public_ip webhook node
  wan="$(detect_wan)"
  [[ -n "$wan" ]] || die "Unable to detect the WAN interface."

  detected_ip="$(detect_public_ip "$wan")"
  node="$(hostname)"

  echo
  info "Detected server:"
  echo "  Hostname  : $node"
  echo "  WAN       : $wan"
  echo "  IPv4      : ${detected_ip:-not detected}"
  echo

  if ask_yes_no "Use interface $wan?" "Y"; then
    :
  else
    read -r -p "Enter WAN interface: " input
    [[ -n "$input" ]] || die "WAN interface cannot be empty."
    wan="$input"
  fi

  public_ip="$detected_ip"
  if [[ -n "$detected_ip" ]]; then
    if ! ask_yes_no "Use IPv4 $detected_ip?" "Y"; then
      read -r -p "Enter public IPv4: " public_ip
    fi
  else
    read -r -p "Enter public IPv4: " public_ip
  fi

  discord_wizard "$node" "$public_ip"
  webhook="$DISCORD_WEBHOOK_SELECTED"
  ai_wizard

  port_wizard
  choose_profile
  while true; do
    AUTO_BLOCK_TIMEOUT="$(ask_value "Automatic source-IP block timeout (for example 30m)" "30m")"
    if valid_block_timeout "$AUTO_BLOCK_TIMEOUT"; then
      break
    fi
    warn "Use a positive nftables duration such as 30s, 30m, 2h, or 1d."
  done

  echo
  echo -e "${C_BOLD}========================================"
  echo "         INSTALLATION CONFIRMATION"
  echo -e "========================================${C_RESET}"
  echo "Node              : $node"
  echo "WAN               : $wan"
  echo "Public IPv4       : $public_ip"
  echo "TCP Protected     : ${TCP_PORT_SET:-Disabled}"
  echo "UDP Protected     : ${UDP_PORT_SET:-Disabled}"
  echo "TCP SYN / port    : $TCP_SYN_RATE/s (burst $TCP_SYN_BURST)"
  echo "TCP PPS / port    : $TCP_PACKET_RATE/s (burst $TCP_PACKET_BURST)"
  echo "UDP PPS / port    : $UDP_PACKET_RATE/s (burst $UDP_PACKET_BURST)"
  echo "Auto-block time   : $AUTO_BLOCK_TIMEOUT"
  echo "Discord           : $([[ -n "$webhook" ]] && echo Enabled || echo Disabled)"
  echo "Gemini AI analyst : $([[ "$AI_ENABLED" == "yes" ]] && echo Enabled || echo Disabled)"
  echo

  ask_yes_no "Is everything correct? Start installation?" "Y" || {
    warn "Installation cancelled."
    exit 0
  }

  backup_firewall
  write_config "$wan" "$public_ip" "$webhook"
  write_guard
  write_service

  info "Validating and applying nftables..."
  "$BIN" apply
  ok "nftables protection is active."

  systemctl enable --now ptero-guard.service
  sleep 1

  if ! systemctl is-active --quiet ptero-guard.service; then
    systemctl status ptero-guard.service --no-pager || true
    die "Service failed to start."
  fi

  ok "ptero-guard.service is active and persistent."

  echo
  echo -e "${C_GREEN}${C_BOLD}INSTALLATION COMPLETE${C_RESET}"
  echo
  echo "Commands:"
  echo "  ptero-guard status"
  echo "  ptero-guard test"
  echo "  AI analysis runs automatically every ${AI_INTERVAL_SECONDS}s when enabled"
  echo "  ptero-guard blocklist"
  echo "  ptero-guard unblock <ipv4>"
  echo "  edit $ALLOWLIST or $BLOCKLIST, then run: ptero-guard apply"
  echo "  journalctl -u ptero-guard -f"
  echo "  systemctl restart ptero-guard"
}

reconfigure_guard() {
  require_root
  [[ -x "$BIN" ]] || die "Ptero Guard is not installed."
  echo "For safety, run Install / Reinstall and complete the wizard again."
}

uninstall_guard() {
  require_root

  echo
  warn "This removes only Ptero Guard."
  echo "UFW and Docker rules will not be removed."
  echo

  ask_yes_no "Continue with uninstall?" "N" || exit 0

  systemctl disable --now ptero-guard.service 2>/dev/null || true
  rm -f "$SERVICE"
  systemctl daemon-reload
  nft destroy table netdev "$TABLE" 2>/dev/null || true
  rm -f "$BIN" "$CONF" "$ALLOWLIST" "$BLOCKLIST" "$AI_KEY_FILE"
  rm -rf /run/ptero-guard

  ok "Ptero Guard was removed successfully."
}

main_menu() {
  require_root

  clear || true
  echo -e "${C_BOLD}========================================"
  echo "          PTERO GUARD INSTALLER"
  echo -e "========================================${C_RESET}"
  echo "Version: $VERSION"
  echo
  echo "1) Install / Reinstall"
  echo "2) Status"
  echo "3) Test Discord Webhook"
  echo "4) Restart Protection"
  echo "5) Uninstall"
  echo "6) Exit"
  echo

  read -r -p "Choose [1-6]: " choice

  case "$choice" in
    1) install_guard ;;
    2)
      [[ -x "$BIN" ]] || die "Ptero Guard is not installed."
      "$BIN" status
      ;;
    3)
      [[ -x "$BIN" ]] || die "Ptero Guard is not installed."
      "$BIN" test
      ;;
    4)
      systemctl restart ptero-guard.service
      systemctl status ptero-guard.service --no-pager
      ;;
    5) uninstall_guard ;;
    6) exit 0 ;;
    *) die "Invalid selection." ;;
  esac
}

main_menu
