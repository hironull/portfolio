import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";

const ContactEmail = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    topic: '',
    message: ''
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const topics = [
    { value: 'collaboration', label: 'Collaboration & Projects' },
    { value: 'freelance', label: 'Freelance Opportunities' },
    { value: 'fulltime', label: 'Full-time Positions' },
    { value: 'mentorship', label: 'Mentorship & Advice' },
    { value: 'networking', label: 'Professional Networking' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailSubject = `${formData.topic ? `[${topics.find(t => t.value === formData.topic)?.label}] ` : ''}${formData.subject}`;
    const emailBody = `Hi,

My name is ${formData.name} and I'm reaching out regarding: ${topics.find(t => t.value === formData.topic)?.label || 'General Inquiry'}

${formData.message}

Best regards,
${formData.name}
${formData.email}`;

    const mailtoLink = `mailto:hironull09@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className="border-b border-border/50 py-4 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Get In Touch</h1>
              <p className="text-sm text-foreground/70">Let's discuss your ideas</p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contact Form */}
      <main className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection animation="slide-in-up">
            <Card className="shadow-2xl border-border/50 hover:shadow-accent/20 hover:border-accent/50 transition-all duration-500 backdrop-blur-xl bg-background/95">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                  Contact Me
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mt-2">
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 hover:border-accent/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        className="focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 hover:border-accent/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1">
                      What would you like to discuss? <span className="text-red-500">*</span>
                    </label>
                    <Select
                      required
                      value={formData.topic}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
                    >
                      <SelectTrigger className="focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 hover:border-accent/50">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value} className="hover:bg-accent/10">
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your inquiry"
                      className="focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 hover:border-accent/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell me more about your project, idea, or inquiry..."
                      rows={5}
                      className="focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 resize-none hover:border-accent/50"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full hover:scale-105 transition-all duration-200 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    You can also reach me directly at{" "}
                    <a 
                      href="mailto:hironull09@gmail.com" 
                      className="text-primary hover:text-accent hover:underline font-medium transition-colors duration-200"
                    >
                      hironull09@gmail.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </main>
    </div>
  );
};

export default ContactEmail;