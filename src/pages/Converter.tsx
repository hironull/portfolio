import { useState } from "react";
import { TerminalWindow } from "../components/TerminalWindow";
import { AnimatedSection } from "../components/AnimatedSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Converter = () => {
  const [gigabytes, setGigabytes] = useState<string>("512");
  const [result, setResult] = useState<{ decimal: number; binary: number } | null>(null);

  const convertToMegabytes = () => {
    const gb = parseFloat(gigabytes);
    if (isNaN(gb)) return;
    
    const decimalMB = gb * 1000; // 1 GB = 1000 MB (decimal)
    const binaryMB = gb * 1024; // 1 GB = 1024 MB (binary)
    
    setResult({ decimal: decimalMB, binary: binaryMB });
  };

  const handleInputChange = (value: string) => {
    setGigabytes(value);
    // Auto-convert as user types
    const gb = parseFloat(value);
    if (!isNaN(gb) && gb > 0) {
      const decimalMB = gb * 1000;
      const binaryMB = gb * 1024;
      setResult({ decimal: decimalMB, binary: binaryMB });
    } else {
      setResult(null);
    }
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
                        Gigabytes to Megabytes Converter
                      </h1>
                    </div>
                    <div className="w-24 h-1 bg-accent mx-auto rounded-full shadow-lg shadow-accent/50" />
                  </div>
                </AnimatedSection>

                {/* Converter Form */}
                <AnimatedSection delay={2}>
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="gigabytes" className="text-foreground font-mono">
                        Gigabytes
                      </Label>
                      <Input
                        id="gigabytes"
                        type="number"
                        value={gigabytes}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="Enter GB value"
                        className="bg-terminal-window/50 border-accent/30 text-foreground font-mono text-lg text-center"
                      />
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={convertToMegabytes}
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
                        <span>Gigabytes</span>
                        <ArrowRight className="w-4 h-4" />
                        <span>Megabytes</span>
                      </div>
                      
                      <div className="bg-terminal-window/30 backdrop-blur-sm p-6 rounded-xl border border-accent/20 space-y-3">
                        <div className="text-foreground font-mono">
                          <span className="text-accent font-bold">{gigabytes} GB</span>
                          <span className="text-muted-foreground"> = </span>
                          <span className="text-accent font-bold">{result.decimal.toLocaleString()} MB</span>
                          <span className="text-muted-foreground"> (in decimal)</span>
                        </div>
                        <div className="text-foreground font-mono">
                          <span className="text-accent font-bold">{gigabytes} GB</span>
                          <span className="text-muted-foreground"> = </span>
                          <span className="text-accent font-bold">{result.binary.toLocaleString()} MB</span>
                          <span className="text-muted-foreground"> (in binary)</span>
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
                      {[
                        { label: "MB to GB", from: "MB", to: "GB" },
                        { label: "GB to TB", from: "GB", to: "TB" },
                        { label: "GB to MB", from: "GB", to: "MB" },
                        { label: "GB to KB", from: "GB", to: "KB" },
                      ].map((conversion, index) => (
                        <Button
                          key={conversion.label}
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs hover:bg-accent/20 hover:border-accent/60"
                          onClick={() => {
                            // For now, just show a tooltip or message
                            console.log(`${conversion.label} conversion`);
                          }}
                        >
                          {conversion.label}
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