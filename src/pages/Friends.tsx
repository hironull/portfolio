import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Friends = () => {
  const friends = [
    {
      name: "Sarah Chen",
      title: "Frontend Developer",
      description: "Specializes in React, Vue.js, and modern CSS frameworks. Creates beautiful user interfaces.",
      website: "https://sarahchen.dev",
      github: "https://github.com/sarahchen",
      skills: ["React", "Vue.js", "TypeScript", "CSS"],
      status: "Available"
    },
    {
      name: "Alex Rodriguez",
      title: "Full Stack Engineer",
      description: "Expert in Node.js, Python, and cloud architecture. Builds scalable web applications.",
      website: "https://alexrodriguez.tech",
      github: "https://github.com/alexrodriguez", 
      skills: ["Node.js", "Python", "AWS", "Docker"],
      status: "Busy"
    },
    {
      name: "Emily Johnson",
      title: "UI/UX Designer",
      description: "Creates intuitive and engaging user experiences. Passionate about accessibility and design systems.",
      website: "https://emilyjohnson.design",
      github: "https://github.com/emilyjohnson",
      skills: ["Figma", "Design Systems", "Prototyping", "Research"],
      status: "Available"
    },
    {
      name: "Marcus Thompson",
      title: "DevOps Engineer", 
      description: "Specializes in CI/CD, infrastructure automation, and cloud security implementations.",
      website: "https://marcusthompson.io",
      github: "https://github.com/marcusthompson",
      skills: ["Kubernetes", "Terraform", "Jenkins", "Security"],
      status: "Available"
    },
    {
      name: "Lisa Wang",
      title: "Mobile Developer",
      description: "Builds cross-platform mobile applications using React Native and Flutter frameworks.",
      website: "https://lisawang.dev",
      github: "https://github.com/lisawang",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      status: "Busy"
    },
    {
      name: "David Kim",
      title: "Backend Developer",
      description: "Focuses on API development, database optimization, and microservices architecture.",
      website: "https://davidkim.tech", 
      github: "https://github.com/davidkim",
      skills: ["Java", "Spring Boot", "PostgreSQL", "Redis"],
      status: "Available"
    },
    {
      name: "Rachel Martinez",
      title: "Data Scientist",
      description: "Analyzes complex datasets and builds machine learning models for business insights.",
      website: "https://rachelmartinez.ai",
      github: "https://github.com/rachelmartinez",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
      status: "Available"
    },
    {
      name: "Tom Wilson",
      title: "Cybersecurity Specialist",
      description: "Protects applications and infrastructure from security threats and vulnerabilities.",
      website: "https://tomwilson.security",
      github: "https://github.com/tomwilson",
      skills: ["Penetration Testing", "Network Security", "Risk Assessment", "Compliance"],
      status: "Busy"
    },
    {
      name: "Jessica Brown",
      title: "Product Manager",
      description: "Bridges the gap between technical teams and business requirements for successful products.",
      website: "https://jessicabrown.pm",
      github: "https://github.com/jessicabrown",
      skills: ["Product Strategy", "Agile", "User Research", "Analytics"],
      status: "Available"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Professional Network</h1>
              <p className="text-foreground/70 mt-2">Connect with talented developers and creators</p>
            </div>
            <Link to="/">
              <Button variant="outline">
                ← Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Friends Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-foreground font-medium">{friends.length} Professional Connections</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-foreground/70">Featured Network</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.map((friend, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {friend.name}
                    </CardTitle>
                    <CardDescription className="font-medium text-primary/80">
                      {friend.title}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={friend.status === "Available" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {friend.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {friend.description}
                </p>
                
                {/* Skills */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-foreground/60 uppercase tracking-wide">
                    Expertise
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {friend.skills.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <a href={friend.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Website
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" asChild>
                    <a href={friend.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-3 w-3 mr-1" />
                      GitHub
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Friends;