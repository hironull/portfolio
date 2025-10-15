import { useState } from "react";
import { TerminalWindow } from "../components/TerminalWindow";
import { AnimatedSection } from "../components/AnimatedSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { ArrowLeft, Calculator, ArrowRight, MapPin, Network, KeyRound, Copy, Check, Globe, Type } from "lucide-react";
import { Link } from "react-router-dom";

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

type Tool = 'converter' | 'ip-geo' | 'dns' | 'password' | 'subdomain' | 'smallcap';

const Converter = () => {
  const [activeTool, setActiveTool] = useState<Tool>('converter');
  const [inputValue, setInputValue] = useState<string>("512");
  const [result, setResult] = useState<{ decimal: number; binary: number } | null>(null);
  const [currentConversion, setCurrentConversion] = useState<string>("GB to MB");
  
  // IP Geolocation states
  const [ipAddress, setIpAddress] = useState<string>("");
  const [geoResult, setGeoResult] = useState<any>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  
  // DNS states
  const [dnsQuery, setDnsQuery] = useState<string>("");
  const [dnsResult, setDnsResult] = useState<any>(null);
  const [dnsLoading, setDnsLoading] = useState(false);
  
  // Password generator states
  const [password, setPassword] = useState<string>("");
  const [passwordLength, setPasswordLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // Subdomain creator states
  const [subdomainName, setSubdomainName] = useState<string>("");
  const [availableDomains] = useState<string[]>(["hironull.lol", "hiro.dev", "hiro.site"]);
  const [selectedDomain, setSelectedDomain] = useState<string>("hironull.lol");
  const [subdomainResult, setSubdomainResult] = useState<any>(null);
  
  // Small cap generator states
  const [inputText, setInputText] = useState<string>("");
  const [smallCapText, setSmallCapText] = useState<string>("");
  const [smallCapCopied, setSmallCapCopied] = useState(false);

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

  // IP Geolocation function
  const lookupIP = async () => {
    if (!ipAddress) return;
    setGeoLoading(true);
    try {
      const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await response.json();
      setGeoResult(data);
    } catch (error) {
      setGeoResult({ error: 'Failed to lookup IP address' });
    }
    setGeoLoading(false);
  };

  // DNS lookup function
  const lookupDNS = async () => {
    if (!dnsQuery) return;
    setDnsLoading(true);
    try {
      const response = await fetch(`https://dns.google/resolve?name=${dnsQuery}`);
      const data = await response.json();
      setDnsResult(data);
    } catch (error) {
      setDnsResult({ error: 'Failed to lookup DNS' });
    }
    setDnsLoading(false);
  };

  // Password generator function
  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (charset === '') return;
    
    let newPassword = '';
    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Subdomain creator function
  const createSubdomain = async () => {
    if (!subdomainName) return;
    
    setSubdomainResult({
      success: false,
      message: "Subdomain creation requires Cloudflare API configuration. Please contact the administrator to set up your free subdomain."
    });
  };

  // Small cap generator function
  const generateSmallCap = () => {
    const smallCapMap: { [key: string]: string } = {
      'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
      'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
      's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    
    const converted = inputText.split('').map(char => {
      const lower = char.toLowerCase();
      return smallCapMap[lower] || char;
    }).join('');
    
    setSmallCapText(converted);
    setSmallCapCopied(false);
  };

  const copySmallCap = () => {
    navigator.clipboard.writeText(smallCapText);
    setSmallCapCopied(true);
    setTimeout(() => setSmallCapCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background blur effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        {/* Navigation */}
        <div className="p-4">
          <Link to="/">
            <Button variant="outline" className="font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatedSection animation="slide-in-up">
            <TerminalWindow title="Tools.exe" className="w-full backdrop-blur-sm bg-terminal-bg/95 border-2 border-accent/30">
              <div className="space-y-8">
                {/* Header */}
                <AnimatedSection delay={1}>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Calculator className="w-8 h-8 text-accent" />
                      <h1 className="text-3xl font-bold font-code text-foreground">
                        Developer Tools
                      </h1>
                    </div>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
                  </div>
                </AnimatedSection>

                {/* Tool Selection */}
                <AnimatedSection delay={1.5}>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button
                      variant={activeTool === 'converter' ? 'default' : 'outline'}
                      size="sm"
                      className={`font-mono transition-all duration-200 ${
                        activeTool === 'converter'
                          ? 'bg-accent hover:bg-accent/80 text-white'
                          : 'hover:bg-accent/20 hover:border-accent/60'
                      }`}
                      onClick={() => setActiveTool('converter')}
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Storage Converter
                    </Button>
                    <Button
                      variant={activeTool === 'ip-geo' ? 'default' : 'outline'}
                      size="sm"
                      className={`font-mono transition-all duration-200 ${
                        activeTool === 'ip-geo'
                          ? 'bg-accent hover:bg-accent/80 text-white'
                          : 'hover:bg-accent/20 hover:border-accent/60'
                      }`}
                      onClick={() => setActiveTool('ip-geo')}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      IP Geolocation
                    </Button>
                    <Button
                      variant={activeTool === 'dns' ? 'default' : 'outline'}
                      size="sm"
                      className={`font-mono transition-all duration-200 ${
                        activeTool === 'dns'
                          ? 'bg-accent hover:bg-accent/80 text-white'
                          : 'hover:bg-accent/20 hover:border-accent/60'
                      }`}
                      onClick={() => setActiveTool('dns')}
                    >
                      <Network className="w-4 h-4 mr-2" />
                      DNS Lookup
                    </Button>
                    <Button
                      variant={activeTool === 'password' ? 'default' : 'outline'}
                      size="sm"
                      className={`font-mono transition-all duration-200 ${
                        activeTool === 'password'
                          ? 'bg-accent hover:bg-accent/80 text-white'
                          : 'hover:bg-accent/20 hover:border-accent/60'
                      }`}
                      onClick={() => setActiveTool('password')}
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Password Generator
                    </Button>
                    <Button
                      variant={activeTool === 'subdomain' ? 'default' : 'outline'}
                      size="sm"
                      className={`font-mono transition-all duration-200 ${
                        activeTool === 'subdomain'
                          ? 'bg-accent hover:bg-accent/80 text-white'
                          : 'hover:bg-accent/20 hover:border-accent/60'
                      }`}
                      onClick={() => setActiveTool('subdomain')}
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Subdomain Creator
                    </Button>
                    <Button
                      variant={activeTool === 'smallcap' ? 'default' : 'outline'}
                      size="sm"
                      className={`font-mono transition-all duration-200 ${
                        activeTool === 'smallcap'
                          ? 'bg-accent hover:bg-accent/80 text-white'
                          : 'hover:bg-accent/20 hover:border-accent/60'
                      }`}
                      onClick={() => setActiveTool('smallcap')}
                    >
                      <Type className="w-4 h-4 mr-2" />
                      Small Cap Generator
                    </Button>
                  </div>
                </AnimatedSection>

                {/* Storage Converter Tool */}
                {activeTool === 'converter' && (
                  <>
                    <AnimatedSection delay={2}>
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
                            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-lg text-center focus:border-accent focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                      </div>
                    </AnimatedSection>

                    {result && (
                      <AnimatedSection animation="fade-in" delay={3}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-center space-x-2 text-accent font-mono">
                            <span>{conversions[currentConversion].from}</span>
                            <ArrowRight className="w-4 h-4" />
                            <span>{conversions[currentConversion].to}</span>
                          </div>
                          
                          <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 space-y-3">
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
                      </AnimatedSection>
                    )}

                    <AnimatedSection delay={4}>
                      <div className="text-center space-y-4">
                        <h3 className="text-lg font-mono text-foreground">Quick Conversions</h3>
                        <div className="flex flex-wrap justify-center gap-2">
                          {Object.keys(conversions).map((conversionKey) => (
                            <Button
                              key={conversionKey}
                              variant={currentConversion === conversionKey ? "default" : "outline"}
                              size="sm"
                              className={`font-mono text-xs transition-all duration-200 ${
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
                  </>
                )}

                {/* IP Geolocation Tool */}
                {activeTool === 'ip-geo' && (
                  <>
                    <AnimatedSection delay={2}>
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="ip-input" className="text-foreground font-mono">
                            IP Address
                          </Label>
                          <Input
                            id="ip-input"
                            type="text"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            placeholder="Enter IP address (e.g., 8.8.8.8)"
                            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center focus:border-accent focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <Button
                          onClick={lookupIP}
                          disabled={geoLoading}
                          className="w-full bg-accent hover:bg-accent/80 text-white font-mono"
                        >
                          {geoLoading ? 'Looking up...' : 'Lookup IP'}
                        </Button>
                      </div>
                    </AnimatedSection>

                    {geoResult && (
                      <AnimatedSection animation="fade-in" delay={3}>
                        <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 space-y-2">
                          {geoResult.error ? (
                            <p className="text-red-500 font-mono">{geoResult.error}</p>
                          ) : (
                            <div className="space-y-2 font-mono text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">IP:</span>
                                <span className="text-accent">{geoResult.ip}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">City:</span>
                                <span className="text-foreground">{geoResult.city}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Region:</span>
                                <span className="text-foreground">{geoResult.region}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Country:</span>
                                <span className="text-foreground">{geoResult.country_name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Timezone:</span>
                                <span className="text-foreground">{geoResult.timezone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">ISP:</span>
                                <span className="text-foreground">{geoResult.org}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </AnimatedSection>
                    )}
                  </>
                )}

                {/* DNS Lookup Tool */}
                {activeTool === 'dns' && (
                  <>
                    <AnimatedSection delay={2}>
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="dns-input" className="text-foreground font-mono">
                            Domain Name
                          </Label>
                          <Input
                            id="dns-input"
                            type="text"
                            value={dnsQuery}
                            onChange={(e) => setDnsQuery(e.target.value)}
                            placeholder="Enter domain (e.g., google.com)"
                            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center focus:border-accent focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <Button
                          onClick={lookupDNS}
                          disabled={dnsLoading}
                          className="w-full bg-accent hover:bg-accent/80 text-white font-mono"
                        >
                          {dnsLoading ? 'Looking up...' : 'Lookup DNS'}
                        </Button>
                      </div>
                    </AnimatedSection>

                    {dnsResult && (
                      <AnimatedSection animation="fade-in" delay={3}>
                        <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 space-y-4">
                          {dnsResult.error ? (
                            <p className="text-red-500 font-mono">{dnsResult.error}</p>
                          ) : (
                            <div className="space-y-4 font-mono text-sm">
                              <div>
                                <h3 className="text-accent mb-2">DNS Records:</h3>
                                {dnsResult.Answer && dnsResult.Answer.length > 0 ? (
                                  <div className="space-y-2">
                                    {dnsResult.Answer.map((record: any, index: number) => (
                                      <div key={index} className="bg-terminal-window/20 p-3 rounded border border-accent/10">
                                        <div className="flex justify-between mb-1">
                                          <span className="text-muted-foreground">Type:</span>
                                          <span className="text-accent">{record.type === 1 ? 'A' : record.type === 28 ? 'AAAA' : record.type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">Data:</span>
                                          <span className="text-foreground break-all">{record.data}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground">No records found</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </AnimatedSection>
                    )}
                  </>
                )}

                {/* Password Generator Tool */}
                {activeTool === 'password' && (
                  <>
                    <AnimatedSection delay={2}>
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="password-length" className="text-foreground font-mono">
                              Password Length: {passwordLength}
                            </Label>
                            <Input
                              id="password-length"
                              type="range"
                              min="8"
                              max="32"
                              value={passwordLength}
                              onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="uppercase"
                                checked={includeUppercase}
                                onChange={(e) => setIncludeUppercase(e.target.checked)}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="uppercase" className="text-foreground font-mono">
                                Include Uppercase (A-Z)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="lowercase"
                                checked={includeLowercase}
                                onChange={(e) => setIncludeLowercase(e.target.checked)}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="lowercase" className="text-foreground font-mono">
                                Include Lowercase (a-z)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="numbers"
                                checked={includeNumbers}
                                onChange={(e) => setIncludeNumbers(e.target.checked)}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="numbers" className="text-foreground font-mono">
                                Include Numbers (0-9)
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="symbols"
                                checked={includeSymbols}
                                onChange={(e) => setIncludeSymbols(e.target.checked)}
                                className="w-4 h-4"
                              />
                              <Label htmlFor="symbols" className="text-foreground font-mono">
                                Include Symbols (!@#$...)
                              </Label>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={generatePassword}
                          className="w-full bg-accent hover:bg-accent/80 text-white font-mono"
                        >
                          Generate Password
                        </Button>
                      </div>
                    </AnimatedSection>

                    {password && (
                      <AnimatedSection animation="fade-in" delay={3}>
                        <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20">
                          <div className="flex items-center justify-between space-x-4">
                            <code className="text-accent font-mono text-lg break-all">{password}</code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyPassword}
                              className="shrink-0"
                            >
                              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </AnimatedSection>
                    )}
                  </>
                )}

                {/* Subdomain Creator Tool */}
                {activeTool === 'subdomain' && (
                  <>
                    <AnimatedSection delay={2}>
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="subdomain-name" className="text-foreground font-mono">
                              Subdomain Name
                            </Label>
                            <Input
                              id="subdomain-name"
                              type="text"
                              value={subdomainName}
                              onChange={(e) => setSubdomainName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                              placeholder="mysite"
                              className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-center focus:border-accent focus:ring-2 focus:ring-accent/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-foreground font-mono">Available Domains</Label>
                            <div className="flex flex-wrap gap-2">
                              {availableDomains.map((domain) => (
                                <Button
                                  key={domain}
                                  variant={selectedDomain === domain ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => setSelectedDomain(domain)}
                                  className={`font-mono ${
                                    selectedDomain === domain
                                      ? 'bg-accent hover:bg-accent/80'
                                      : 'hover:bg-accent/20'
                                  }`}
                                >
                                  {domain}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {subdomainName && (
                            <div className="p-4 bg-terminal-window/30 rounded-lg border border-accent/20">
                              <p className="text-foreground font-mono text-center">
                                Your subdomain will be:
                              </p>
                              <p className="text-accent font-mono text-lg text-center mt-2">
                                {subdomainName}.{selectedDomain}
                              </p>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={createSubdomain}
                          className="w-full bg-accent hover:bg-accent/80 text-white font-mono"
                        >
                          Create Subdomain
                        </Button>
                      </div>
                    </AnimatedSection>

                    {subdomainResult && (
                      <AnimatedSection animation="fade-in" delay={3}>
                        <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20">
                          <p className={`font-mono text-sm ${subdomainResult.success ? 'text-green-500' : 'text-yellow-500'}`}>
                            {subdomainResult.message}
                          </p>
                        </div>
                      </AnimatedSection>
                    )}
                  </>
                )}

                {/* Small Cap Generator Tool */}
                {activeTool === 'smallcap' && (
                  <>
                    <AnimatedSection delay={2}>
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="input-text" className="text-foreground font-mono">
                            Enter Text
                          </Label>
                          <Textarea
                            id="input-text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Type your text here..."
                            rows={4}
                            className="bg-terminal-window/50 border-accent/30 text-foreground font-mono focus:border-accent focus:ring-2 focus:ring-accent/20"
                          />
                        </div>

                        <Button
                          onClick={generateSmallCap}
                          className="w-full bg-accent hover:bg-accent/80 text-white font-mono"
                        >
                          Generate Small Caps
                        </Button>
                      </div>
                    </AnimatedSection>

                    {smallCapText && (
                      <AnimatedSection animation="fade-in" delay={3}>
                        <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-muted-foreground font-mono text-sm mb-2 block">
                                Small Caps Result:
                              </Label>
                              <p className="text-accent font-mono text-xl break-all">{smallCapText}</p>
                            </div>
                            <Button
                              variant="outline"
                              onClick={copySmallCap}
                              className="w-full font-mono"
                            >
                              {smallCapCopied ? (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy to Clipboard
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </AnimatedSection>
                    )}
                  </>
                )}
              </div>
            </TerminalWindow>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Converter;