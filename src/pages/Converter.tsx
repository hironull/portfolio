import { useState } from "react";
import { TerminalWindow } from "../components/TerminalWindow";
import { AnimatedSection } from "../components/AnimatedSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Calculator, ArrowRight } from "lucide-react";
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

const Converter = () => {
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
            <TerminalWindow title="Converter.exe" className="w-full backdrop-blur-sm bg-terminal-bg/95 border-2 border-accent/30">
              <div className="space-y-8">
                {/* Header */}
                <AnimatedSection delay={1}>
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <Calculator className="w-8 h-8 text-accent" />
                      <h1 className="text-3xl font-bold font-code text-foreground">
                        {conversions[currentConversion].title}
                      </h1>
                    </div>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
                  </div>
                </AnimatedSection>

                {/* Converter Form */}
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

                    <div className="flex justify-center">
                      <Button
                        onClick={convert}
                        className="bg-accent hover:bg-accent/80 text-white font-mono px-8 py-2"
                      >
                        Convert
                      </Button>
                    </div>
                  </div>
                </AnimatedSection>

                {/* Result Display */}
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
              </div>
            </TerminalWindow>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
};

export default Converter;