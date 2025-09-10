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
  const [result, setResult] = useState<{ decimal: number; binary: number } | null>(null);
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
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Calculator className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold font-code text-foreground">
            {conversions[currentConversion].title}
          </h2>
        </div>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
      </div>

      {/* Converter Form */}
      <div className="max-w-md mx-auto space-y-6">
        <div className="space-y-2">
          <Label htmlFor="input-value" className="text-foreground font-mono">
            {conversions[currentConversion].from}
          </Label>
          <Input
            id="input-value"
            type="number"
            min="0"
            step="any"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={`Enter ${conversions[currentConversion].from} value`}
            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-lg text-center focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
          />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={convert}
            className="bg-accent hover:bg-accent/80 text-white font-mono px-8 py-2 transform hover:scale-105 transition-all duration-200"
          >
            Convert
          </Button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 text-accent font-mono">
            <span>{conversions[currentConversion].from}</span>
            <ArrowRight className="w-4 h-4" />
            <span>{conversions[currentConversion].to}</span>
          </div>
          
          <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 space-y-3 hover:border-accent/40 transition-all duration-300">
            <div className="text-foreground font-mono">
              <span className="text-accent font-bold">{parseFloat(inputValue).toLocaleString()} {conversions[currentConversion].from}</span>
              <span className="text-muted-foreground"> = </span>
              <span className="text-accent font-bold">{result.decimal.toLocaleString(undefined, { maximumFractionDigits: 6 })} {conversions[currentConversion].to}</span>
              <span className="text-muted-foreground"> (decimal)</span>
            </div>
            <div className="text-foreground font-mono">
              <span className="text-accent font-bold">{parseFloat(inputValue).toLocaleString()} {conversions[currentConversion].from}</span>
              <span className="text-muted-foreground"> = </span>
              <span className="text-accent font-bold">{result.binary.toLocaleString(undefined, { maximumFractionDigits: 6 })} {conversions[currentConversion].to}</span>
              <span className="text-muted-foreground"> (binary)</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Conversion Links */}
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
    </div>
  );
};

// Password Generator Component
const PasswordGenerator = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>("");
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
  };

  const copyPassword = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      toast({ title: "Copied!", description: "Password copied to clipboard" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Shield className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold font-code text-foreground">Password Generator</h2>
        </div>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
      </div>

      <div className="space-y-6">
        {/* Password Display */}
        <div className="space-y-2">
          <Label className="text-foreground font-mono">Generated Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              readOnly
              placeholder="Click generate to create password"
              className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center pr-20 focus:border-accent transition-all duration-300"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowPassword(!showPassword)}
                className="h-8 w-8 p-0 hover:bg-accent/20"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyPassword}
                className="h-8 w-8 p-0 hover:bg-accent/20"
                disabled={!password}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Password Length */}
        <div className="space-y-2">
          <Label className="text-foreground font-mono">Length: {length[0]}</Label>
          <Slider
            value={length}
            onValueChange={setLength}
            min={4}
            max={128}
            step={1}
            className="w-full"
          />
        </div>

        {/* Character Options */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono">Uppercase Letters (A-Z)</Label>
            <Switch checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono">Lowercase Letters (a-z)</Label>
            <Switch checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono">Numbers (0-9)</Label>
            <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono">Symbols (!@#$...)</Label>
            <Switch checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-foreground font-mono">Exclude Similar (i, l, 1, L, o, 0, O)</Label>
            <Switch checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
          </div>
        </div>

        <Button
          onClick={generatePassword}
          className="w-full bg-accent hover:bg-accent/80 text-white font-mono py-3 transform hover:scale-105 transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Password
        </Button>
      </div>
    </div>
  );
};

// DNS Pinger Component
const DnsPinger = () => {
  const { toast } = useToast();
  const [domain, setDomain] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dnsServers = [
    { name: "Google", ip: "8.8.8.8" },
    { name: "Cloudflare", ip: "1.1.1.1" },
    { name: "OpenDNS", ip: "208.67.222.222" },
    { name: "Quad9", ip: "9.9.9.9" }
  ];

  const performDnsLookup = async () => {
    if (!domain) {
      toast({ title: "Error", description: "Please enter a domain name", variant: "destructive" });
      return;
    }

    setLoading(true);
    const testResults = [];

    // Simulate DNS lookups with realistic data
    for (const server of dnsServers) {
      const startTime = performance.now();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
      
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      testResults.push({
        server: server.name,
        ip: server.ip,
        responseTime: responseTime,
        status: responseTime < 150 ? "Good" : responseTime < 300 ? "Fair" : "Slow",
        resolvedIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      });
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Globe className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold font-code text-foreground">DNS Pinger</h2>
        </div>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain" className="text-foreground font-mono">Domain or IP Address</Label>
          <Input
            id="domain"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.com"
            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono focus:border-accent transition-all duration-300"
          />
        </div>

        <Button
          onClick={performDnsLookup}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/80 text-white font-mono py-3 transform hover:scale-105 transition-all duration-200"
        >
          {loading ? "Testing..." : "Test DNS & Ping"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-mono text-foreground text-center">DNS Response Times</h3>
          <div className="grid gap-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-terminal-window/30 backdrop-blur-sm p-4 rounded-xl border border-accent/20 hover:border-accent/40 transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-mono text-foreground font-bold">{result.server} DNS</div>
                    <div className="font-mono text-sm text-muted-foreground">{result.ip}</div>
                    <div className="font-mono text-sm text-muted-foreground">Resolved: {result.resolvedIp}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className={`font-mono font-bold ${
                      result.status === "Good" ? "text-green-400" : 
                      result.status === "Fair" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {result.responseTime}ms
                    </div>
                    <div className={`text-sm font-mono ${
                      result.status === "Good" ? "text-green-400" : 
                      result.status === "Fair" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {result.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// IP Location Component  
const IpLocation = () => {
  const { toast } = useToast();
  const [ipAddress, setIpAddress] = useState("");
  const [locationData, setLocationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const lookupLocation = async () => {
    let targetIp = ipAddress;
    
    if (!targetIp) {
      // Get user's IP
      targetIp = "auto";
    }

    setLoading(true);

    // Simulate API call with realistic data
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockData = {
      ip: targetIp === "auto" ? "203.0.113.42" : targetIp,
      country: "United States",
      region: "California",
      city: "San Francisco",
      latitude: 37.7749,
      longitude: -122.4194,
      timezone: "America/Los_Angeles",
      isp: "Example ISP",
      org: "Example Organization",
      as: "AS12345 Example Networks"
    };

    setLocationData(mockData);
    setLoading(false);
  };

  const copyData = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Data copied to clipboard" });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <MapPin className="w-8 h-8 text-accent" />
          <h2 className="text-2xl font-bold font-code text-foreground">IP Geolocation</h2>
        </div>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ip" className="text-foreground font-mono">IP Address (leave empty for your IP)</Label>
          <Input
            id="ip"
            type="text"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            placeholder="192.168.1.1 or leave empty"
            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono focus:border-accent transition-all duration-300"
          />
        </div>

        <Button
          onClick={lookupLocation}
          disabled={loading}
          className="w-full bg-accent hover:bg-accent/80 text-white font-mono py-3 transform hover:scale-105 transition-all duration-200"
        >
          {loading ? "Looking up..." : "Get Location"}
        </Button>
      </div>

      {locationData && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-lg font-mono text-foreground text-center">Location Information</h3>
          <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 space-y-4 hover:border-accent/40 transition-all duration-300">
            {Object.entries(locationData).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center group">
                <span className="font-mono text-muted-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-foreground font-bold">{value as string}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyData(value as string)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent/20 transition-all duration-200"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Converter = () => {
  const [currentTool, setCurrentTool] = useState<ToolType>('converter');

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

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <div className="p-4">
          <Link to="/">
            <Button variant="outline" className="font-mono transform hover:scale-105 transition-all duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <AnimatedSection animation="slide-in-up">
            <TerminalWindow title="DevTools.exe" className="w-full backdrop-blur-sm bg-terminal-bg/95 border-2 border-accent/30">
              <div className="space-y-8">
                {/* Header */}
                <AnimatedSection delay={1}>
                  <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold font-code text-foreground">
                      Developer Tools Suite
                    </h1>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
                  </div>
                </AnimatedSection>

                {/* Tool Selection */}
                <AnimatedSection delay={2}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tools.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <Button
                          key={tool.id}
                          variant={currentTool === tool.id ? "default" : "outline"}
                          className={`p-4 h-auto flex flex-col items-center space-y-2 font-mono transition-all duration-300 transform hover:scale-105 ${
                            currentTool === tool.id 
                              ? "bg-accent hover:bg-accent/80 text-white shadow-lg shadow-accent/30" 
                              : "hover:bg-accent/20 hover:border-accent/60"
                          }`}
                          onClick={() => setCurrentTool(tool.id)}
                        >
                          <IconComponent className="w-6 h-6" />
                          <div className="text-center">
                            <div className="font-bold text-sm">{tool.name}</div>
                            <div className="text-xs opacity-80">{tool.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </AnimatedSection>

                {/* Tool Content */}
                <AnimatedSection delay={3} key={currentTool} animation="fade-in">
                  <div className="bg-terminal-window/20 backdrop-blur-sm p-6 rounded-xl border border-accent/20 hover:border-accent/30 transition-all duration-500">
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