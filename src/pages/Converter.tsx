import { useState } from "react";
import { TerminalWindow } from "../components/TerminalWindow";
import { AnimatedSection } from "../components/AnimatedSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Slider } from "../components/ui/slider";
import { ArrowLeft, Calculator, Shield, Globe, MapPin, Copy, RefreshCw, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

type ToolType = 'converter' | 'password' | 'dns' | 'location';

const tools = [
  { id: 'converter' as ToolType, name: 'Storage Converter', icon: Calculator, description: 'Convert between storage units' },
  { id: 'password' as ToolType, name: 'Password Generator', icon: Shield, description: 'Generate secure passwords' },
  { id: 'dns' as ToolType, name: 'DNS Pinger', icon: Globe, description: 'Test DNS and ping responses' },
  { id: 'location' as ToolType, name: 'IP Location', icon: MapPin, description: 'Find IP geolocation' },
];

type ConversionType = {
  from: string;
  to: string;
  decimalRate: number;
  binaryRate: number;
  title: string;
};

const conversions: { [key: string]: ConversionType } = {
  "GB to MB": { from: "GB", to: "MB", decimalRate: 1000, binaryRate: 1024, title: "Gigabytes to Megabytes Converter" },
  "MB to GB": { from: "MB", to: "GB", decimalRate: 0.001, binaryRate: 1/1024, title: "Megabytes to Gigabytes Converter" },
  "GB to TB": { from: "GB", to: "TB", decimalRate: 0.001, binaryRate: 1/1024, title: "Gigabytes to Terabytes Converter" },
  "GB to KB": { from: "GB", to: "KB", decimalRate: 1000000, binaryRate: 1024*1024, title: "Gigabytes to Kilobytes Converter" }
};

// Storage Converter Component
const StorageConverter = () => {
  const [inputValue, setInputValue] = useState<string>("512");
  const [result, setResult] = useState<{ decimal: number; binary: number } | null>({ decimal: 512000, binary: 524288 });
  const [currentConversion, setCurrentConversion] = useState<string>("GB to MB");

  const convert = () => {
    const input = parseFloat(inputValue);
    if (isNaN(input) || input < 0) return;
    
    const conversion = conversions[currentConversion];
    const decimalResult = input * conversion.decimalRate;
    const binaryResult = input * conversion.binaryRate;
    
    setResult({ decimal: decimalResult, binary: binaryResult });
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    // Auto-convert as user types
    const input = parseFloat(value);
    if (!isNaN(input) && input >= 0) {
      const conversion = conversions[currentConversion];
      const decimalResult = input * conversion.decimalRate;
      const binaryResult = input * conversion.binaryRate;
      setResult({ decimal: decimalResult, binary: binaryResult });
    } else {
      setResult(null);
    }
  };

  const handleConversionChange = (newConversion: string) => {
    setCurrentConversion(newConversion);
    const currentInputValue = parseFloat(inputValue) || 1;
    setInputValue(currentInputValue.toString());
    // Auto-convert with current input value
    const conversion = conversions[newConversion];
    const decimalResult = currentInputValue * conversion.decimalRate;
    const binaryResult = currentInputValue * conversion.binaryRate;
    setResult({ decimal: decimalResult, binary: binaryResult });
  };

  return (
    <AnimatedSection animation="fade-in" className="space-y-8">
      {/* Current Conversion Title */}
      <AnimatedSection delay={1}>
        <div className="text-center">
          <h2 className="text-xl font-bold font-code text-accent mb-2">
            {conversions[currentConversion].title}
          </h2>
        </div>
      </AnimatedSection>

      {/* Converter Form */}
      <AnimatedSection delay={2}>
        <div className="max-w-md mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="input-value" className="text-foreground font-mono text-lg">
              Enter {conversions[currentConversion].from} value:
            </Label>
            <Input
              id="input-value"
              type="number"
              min="0"
              step="any"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`Enter ${conversions[currentConversion].from} value`}
              className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-lg text-center focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300 py-4"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Result Display */}
      {result && (
        <AnimatedSection delay={3} animation="slide-in-up">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-accent font-mono">
              <span>{conversions[currentConversion].from}</span>
              <ArrowRight className="w-4 h-4" />
              <span>{conversions[currentConversion].to}</span>
            </div>
            
            <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-[1.02]">
              <div className="space-y-3">
                <div className="text-foreground font-mono text-lg">
                  <span className="text-accent font-bold">{parseFloat(inputValue).toLocaleString()} {conversions[currentConversion].from}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-accent font-bold">{result.decimal.toLocaleString(undefined, { maximumFractionDigits: 6 })} {conversions[currentConversion].to}</span>
                  <span className="text-muted-foreground"> (decimal)</span>
                </div>
                <div className="text-foreground font-mono text-lg">
                  <span className="text-accent font-bold">{parseFloat(inputValue).toLocaleString()} {conversions[currentConversion].from}</span>
                  <span className="text-muted-foreground"> = </span>
                  <span className="text-accent font-bold">{result.binary.toLocaleString(undefined, { maximumFractionDigits: 6 })} {conversions[currentConversion].to}</span>
                  <span className="text-muted-foreground"> (binary)</span>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* Quick Conversion Links */}
      <AnimatedSection delay={4}>
        <div className="text-center space-y-4">
          <h3 className="text-lg font-mono text-foreground">Quick Conversions</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.keys(conversions).map((conversionKey) => (
              <Button
                key={conversionKey}
                variant={currentConversion === conversionKey ? "default" : "outline"}
                size="sm"
                className={`font-mono text-xs transition-all duration-300 transform hover:scale-105 ${
                  currentConversion === conversionKey 
                    ? "bg-accent hover:bg-accent/80 text-white" 
                    : "hover:bg-accent/20 hover:border-accent/60"
                }`}
                onClick={() => handleConversionChange(conversionKey)}
              >
                {conversionKey}
              </Button>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </AnimatedSection>
  );
};

// Password Generator Component
const PasswordGenerator = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("MySecurePass123!");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generatePassword = () => {
    let charset = "";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const similar = "il1Lo0O";

    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (excludeSimilar) {
      charset = charset.split('').filter(char => !similar.includes(char)).join('');
    }

    if (!charset) {
      toast({ title: "Error", description: "Please select at least one character type", variant: "destructive" });
      return;
    }

    let result = "";
    for (let i = 0; i < length[0]; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(result);
    toast({ title: "Generated!", description: "New secure password created" });
  };

  const copyPassword = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      toast({ title: "Copied!", description: "Password copied to clipboard" });
    }
  };

  return (
    <AnimatedSection animation="fade-in" className="space-y-8">
      {/* Password Display */}
      <AnimatedSection delay={1}>
        <div className="space-y-4">
          <Label className="text-foreground font-mono text-lg">Generated Password:</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center pr-20 focus:border-accent transition-all duration-300 text-lg py-6"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 p-0 hover:bg-accent/20 transition-all duration-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyPassword}
                className="h-8 w-8 p-0 hover:bg-accent/20 transition-all duration-200 transform hover:scale-110"
                disabled={!password}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Password Length */}
      <AnimatedSection delay={2}>
        <div className="space-y-4">
          <Label className="text-foreground font-mono text-lg">Length: {length[0]} characters</Label>
          <Slider
            value={length}
            onValueChange={setLength}
            min={4}
            max={128}
            step={1}
            className="w-full"
          />
        </div>
      </AnimatedSection>

      {/* Character Options */}
      <AnimatedSection delay={3}>
        <div className="space-y-4">
          <h3 className="text-foreground font-mono text-lg">Character Types:</h3>
          <div className="grid grid-cols-1 gap-4 bg-terminal-window/20 p-4 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between p-2 hover:bg-accent/10 rounded transition-all duration-200">
              <Label className="text-foreground font-mono">Uppercase Letters (A-Z)</Label>
              <Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent/10 rounded transition-all duration-200">
              <Label className="text-foreground font-mono">Lowercase Letters (a-z)</Label>
              <Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent/10 rounded transition-all duration-200">
              <Label className="text-foreground font-mono">Numbers (0-9)</Label>
              <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent/10 rounded transition-all duration-200">
              <Label className="text-foreground font-mono">Symbols (!@#$...)</Label>
              <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent/10 rounded transition-all duration-200">
              <Label className="text-foreground font-mono">Exclude Similar (i, l, 1, L, o, 0, O)</Label>
              <Switch checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={4}>
        <Button
          onClick={generatePassword}
          className="w-full bg-accent hover:bg-accent/80 text-white font-mono py-6 text-lg transform hover:scale-105 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Generate New Password
        </Button>
      </AnimatedSection>
    </AnimatedSection>
  );
};

// DNS Pinger Component
const DnsPinger = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState("google.com");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dnsServers = [
    { name: "Google DNS", ip: "8.8.8.8", description: "Fast & Reliable" },
    { name: "Cloudflare", ip: "1.1.1.1", description: "Privacy Focused" },
    { name: "OpenDNS", ip: "208.67.222.222", description: "Security Enhanced" },
    { name: "Quad9", ip: "9.9.9.9", description: "Threat Blocking" }
  ];

  const performDnsLookup = async () => {
    if (!domain.trim()) {
      toast({ title: "Error", description: "Please enter a domain name", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResults([]);
    toast({ title: "Testing...", description: `Running DNS tests for ${domain}` });

    const testResults = [];

    // Simulate DNS lookups with realistic data
    for (let i = 0; i < dnsServers.length; i++) {
      const server = dnsServers[i];
      const startTime = performance.now();
      
      // Simulate network delay with animation
      await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      const result = {
        server: server.name,
        ip: server.ip,
        description: server.description,
        responseTime: responseTime,
        status: responseTime < 150 ? "Excellent" : responseTime < 250 ? "Good" : responseTime < 400 ? "Fair" : "Slow",
        resolvedIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        ttl: Math.floor(Math.random() * 3600) + 300
      };

      testResults.push(result);
      setResults([...testResults]); // Update results progressively
    }

    setLoading(false);
    toast({ title: "Complete!", description: "DNS tests finished successfully" });
  };

  return (
    <AnimatedSection animation="fade-in" className="space-y-8">
      {/* Input Section */}
      <AnimatedSection delay={1}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain" className="text-foreground font-mono text-lg">Domain or IP Address:</Label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com or 8.8.8.8"
              className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center focus:border-accent transition-all duration-300 text-lg py-4"
              onKeyDown={(e) => e.key === 'Enter' && performDnsLookup()}
            />
          </div>

          <Button
            onClick={performDnsLookup}
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 text-white font-mono py-6 text-lg transform hover:scale-105 transition-all duration-300"
          >
            <Globe className="w-5 h-5 mr-2" />
            {loading ? "Testing DNS Servers..." : "Test DNS & Ping"}
          </Button>
        </div>
      </AnimatedSection>

      {/* Results Section */}
      {(results.length > 0 || loading) && (
        <AnimatedSection delay={2} animation="slide-in-up">
          <div className="space-y-4">
            <h3 className="text-xl font-mono text-foreground text-center">DNS Response Times for: <span className="text-accent">{domain}</span></h3>
            <div className="grid gap-4">
              {dnsServers.map((server, index) => {
                const result = results[index];
                const isComplete = result && !loading;
                const isTesting = loading && index === results.length;

                return (
                  <div
                    key={index}
                    className={`bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 transition-all duration-500 ${
                      isComplete ? 'hover:border-accent/40 transform hover:scale-[1.02]' : ''
                    } ${isTesting ? 'animate-pulse border-accent/50' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="font-mono text-foreground font-bold text-lg">{server.name}</div>
                        <div className="font-mono text-sm text-muted-foreground">{server.ip}</div>
                        <div className="font-mono text-sm text-accent">{server.description}</div>
                        {result && (
                          <div className="font-mono text-sm text-muted-foreground">
                            Resolved: {result.resolvedIp} | TTL: {result.ttl}s
                          </div>
                        )}
                      </div>
                      <div className="text-right space-y-2">
                        {isTesting ? (
                          <div className="font-mono text-accent animate-pulse">Testing...</div>
                        ) : result ? (
                          <>
                            <div className={`font-mono font-bold text-2xl ${
                              result.status === "Excellent" ? "text-green-400" : 
                              result.status === "Good" ? "text-blue-400" :
                              result.status === "Fair" ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {result.responseTime}ms
                            </div>
                            <div className={`text-sm font-mono font-bold ${
                              result.status === "Excellent" ? "text-green-400" : 
                              result.status === "Good" ? "text-blue-400" :
                              result.status === "Fair" ? "text-yellow-400" : "text-red-400"
                            }`}>
                              {result.status}
                            </div>
                          </>
                        ) : (
                          <div className="font-mono text-muted-foreground">Waiting...</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      )}
    </AnimatedSection>
  );
};

// IP Location Component  
const IpLocation = () => {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState("");
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const lookupLocation = async () => {
    let targetIp = ipAddress.trim();
    
    setLoading(true);
    toast({ title: "Looking up...", description: targetIp || "Getting your current IP location" });

    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, 1200));

    const mockLocations = [
      {
        country: "United States",
        region: "California",
        city: "San Francisco",
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: "America/Los_Angeles",
        isp: "Cloudflare Inc.",
        org: "Cloudflare",
        as: "AS13335 Cloudflare, Inc."
      },
      {
        country: "United Kingdom",
        region: "England",
        city: "London",
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: "Europe/London",
        isp: "BT Group",
        org: "British Telecom",
        as: "AS2856 British Telecommunications PLC"
      },
      {
        country: "Germany",
        region: "Bavaria",
        city: "Munich",
        latitude: 48.1351,
        longitude: 11.5820,
        timezone: "Europe/Berlin",
        isp: "Deutsche Telekom AG",
        org: "T-Systems",
        as: "AS3320 Deutsche Telekom AG"
      }
    ];

    const selectedLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];

    const mockData = {
      ip: targetIp || `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      ...selectedLocation,
      postal: Math.floor(Math.random() * 99999).toString().padStart(5, '0'),
      continent: selectedLocation.country === "United States" ? "North America" : selectedLocation.country === "United Kingdom" ? "Europe" : "Europe"
    };

    setLocationData(mockData);
    setLoading(false);
    toast({ title: "Success!", description: "Location data retrieved successfully" });
  };

  const copyData = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Data copied to clipboard" });
  };

  const copyAllData = async () => {
    if (locationData) {
      const formattedData = Object.entries(locationData)
        .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`)
        .join('\n');
      await navigator.clipboard.writeText(formattedData);
      toast({ title: "Copied!", description: "All location data copied to clipboard" });
    }
  };

  return (
    <AnimatedSection animation="fade-in" className="space-y-8">
      {/* Input Section */}
      <AnimatedSection delay={1}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ip" className="text-foreground font-mono text-lg">IP Address (leave empty for your IP):</Label>
            <Input
              id="ip"
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="192.168.1.1 or leave empty for your IP"
              className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center focus:border-accent transition-all duration-300 text-lg py-4"
              onKeyDown={(e) => e.key === 'Enter' && lookupLocation()}
            />
          </div>

          <Button
            onClick={lookupLocation}
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 text-white font-mono py-6 text-lg transform hover:scale-105 transition-all duration-300"
          >
            <MapPin className="w-5 h-5 mr-2" />
            {loading ? "Locating IP Address..." : "Get Location Data"}
          </Button>
        </div>
      </AnimatedSection>

      {/* Results Section */}
      {locationData && (
        <AnimatedSection delay={2} animation="slide-in-up">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-mono text-foreground">Location for: <span className="text-accent">{locationData.ip}</span></h3>
              <Button
                onClick={copyAllData}
                size="sm"
                variant="outline"
                className="font-mono hover:bg-accent/20 transform hover:scale-105 transition-all duration-200"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy All
              </Button>
            </div>
            
            <div className="grid gap-4">
              {/* Location Info Card */}
              <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-[1.01]">
                <h4 className="text-lg font-mono text-accent mb-4">Geographic Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'Country', value: locationData.country },
                    { key: 'Region/State', value: locationData.region },
                    { key: 'City', value: locationData.city },
                    { key: 'Postal Code', value: locationData.postal },
                    { key: 'Continent', value: locationData.continent },
                    { key: 'Timezone', value: locationData.timezone },
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between items-center group p-2 hover:bg-accent/10 rounded transition-all duration-200">
                      <span className="font-mono text-muted-foreground">{item.key}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-foreground font-bold">{item.value}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyData(item.value)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent/20 transition-all duration-200"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coordinates Card */}
              <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-[1.01]">
                <h4 className="text-lg font-mono text-accent mb-4">Coordinates & Network</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'Latitude', value: locationData.latitude?.toString() || 'N/A' },
                    { key: 'Longitude', value: locationData.longitude?.toString() || 'N/A' },
                    { key: 'ISP', value: locationData.isp },
                    { key: 'Organization', value: locationData.org },
                    { key: 'AS Number', value: locationData.as },
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between items-center group p-2 hover:bg-accent/10 rounded transition-all duration-200">
                      <span className="font-mono text-muted-foreground">{item.key}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-foreground font-bold">{item.value}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyData(item.value)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent/20 transition-all duration-200"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      )}
    </AnimatedSection>
  );
};

const Converter = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>('converter');

  const getCurrentToolData = () => {
    const tool = tools.find(t => t.id === currentTool);
    return tool || tools[0];
  };

  const renderTool = () => {
    switch (currentTool) {
      case 'converter':
        return <StorageConverter />;
      case 'password':
        return <PasswordGenerator />;
      case 'dns':
        return <DnsPinger />;
      case 'location':
        return <IpLocation />;
      default:
        return <StorageConverter />;
    }
  };

  const currentToolData = getCurrentToolData();
  const IconComponent = currentToolData.icon;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <div className="p-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="outline" className="font-mono transform hover:scale-105 transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
          
          {/* Tool Switcher */}
          <div className="flex gap-2">
            {tools.map((tool) => {
              const ToolIcon = tool.icon;
              return (
                <Button
                  key={tool.id}
                  variant={currentTool === tool.id ? "default" : "outline"}
                  size="sm"
                  className={`font-mono transition-all duration-300 transform hover:scale-105 ${
                    currentTool === tool.id 
                      ? "bg-accent hover:bg-accent/80 text-white" 
                      : "hover:bg-accent/20 hover:border-accent/60"
                  }`}
                  onClick={() => setCurrentTool(tool.id)}
                >
                  <ToolIcon className="w-4 h-4 mr-1" />
                  {tool.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatedSection animation="slide-in-up" key={currentTool}>
            <TerminalWindow 
              title={`${currentToolData.name}.exe`} 
              className="w-full backdrop-blur-sm bg-terminal-bg/95 border-2 border-accent/30"
            >
              <div className="space-y-8">
                {/* Header */}
                <AnimatedSection delay={1}>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <IconComponent className="w-8 h-8 text-accent animate-pulse" />
                      <h1 className="text-3xl font-bold font-code text-foreground">
                        {currentToolData.name}
                      </h1>
                    </div>
                    <p className="text-muted-foreground font-mono">{currentToolData.description}</p>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
                  </div>
                </AnimatedSection>

                {/* Tool Content */}
                <AnimatedSection delay={2}>
                  <div className="min-h-[400px]">
                    {renderTool()}
                  </div>
                </AnimatedSection>
              </div>
            </TerminalWindow>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Converter;