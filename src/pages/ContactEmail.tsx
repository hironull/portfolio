import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "@/components/AnimatedSection";

const ContactEmail = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    topic: '',
    message: ''
  });

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-4">
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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <AnimatedSection animation="slide-in-up">
            <Card className="shadow-lg border-border/50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Contact Me</CardTitle>
                <CardDescription>
                  Fill out the form below and I'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Name *
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        className="focus:ring-primary/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        className="focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      What would you like to discuss? *
                    </label>
                    <Select
                      required
                      value={formData.topic}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
                    >
                      <SelectTrigger className="focus:ring-primary/20">
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic.value} value={topic.value}>
                            {topic.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Subject *
                    </label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your inquiry"
                      className="focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Message *
                    </label>
                    <Textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell me more about your project, idea, or inquiry..."
                      rows={5}
                      className="focus:ring-primary/20"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full hover:scale-105 transition-transform duration-200"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    You can also reach me directly at{" "}
                    <a 
                      href="mailto:hironull09@gmail.com" 
                      className="text-primary hover:underline font-medium"
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