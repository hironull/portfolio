import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Zap, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Friends = () => {
  const friendsData = {
    "Best Friends": [
      {
        name: "Sarah Chen",
        title: "Frontend Developer",
        skills: ["React", "Vue.js", "TypeScript"],
        status: "Available"
      },
      {
        name: "Alex Rodriguez", 
        title: "Full Stack Engineer",
        skills: ["Node.js", "Python", "AWS"],
        status: "Busy"
      }
    ],
    "Bros": [
      {
        name: "Marcus Thompson",
        title: "DevOps Engineer",
        skills: ["Kubernetes", "Terraform", "Jenkins"],
        status: "Available"
      },
      {
        name: "David Kim",
        title: "Backend Developer", 
        skills: ["Java", "Spring Boot", "PostgreSQL"],
        status: "Available"
      },
      {
        name: "Tom Wilson",
        title: "Cybersecurity Specialist",
        skills: ["Penetration Testing", "Network Security"],
        status: "Busy"
      }
    ],
    "Special Persons": [
      {
        name: "Emily Johnson",
        title: "UI/UX Designer",
        skills: ["Figma", "Design Systems", "Prototyping"],
        status: "Available"
      },
      {
        name: "Rachel Martinez",
        title: "Data Scientist",
        skills: ["Python", "Machine Learning", "TensorFlow"],
        status: "Available"
      }
    ],
    "Pookie": [
      {
        name: "Lisa Wang",
        title: "Mobile Developer",
        skills: ["React Native", "Flutter", "iOS"],
        status: "Busy"
      },
      {
        name: "Jessica Brown",
        title: "Product Manager",
        skills: ["Product Strategy", "Agile", "User Research"],
        status: "Available"
      }
    ]
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Best Friends": return <Heart className="h-4 w-4" />;
      case "Bros": return <Users className="h-4 w-4" />;
      case "Special Persons": return <Star className="h-4 w-4" />;
      case "Pookie": return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const totalFriends = Object.values(friendsData).flat().length;

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <header className="border-b border-border/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Network</h1>
              <p className="text-sm text-foreground/70">Professional connections & friends</p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">← Back</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Compact Stats */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">{totalFriends} Connections</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            <span className="text-foreground/70">{Object.keys(friendsData).length} Categories</span>
          </div>
        </div>
      </div>

      {/* Compact Friends by Category */}
      <main className="container mx-auto px-4 pb-8">
        <div className="space-y-6">
          {Object.entries(friendsData).map(([category, friends]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center space-x-2 pb-2 border-b border-border/30">
                {getCategoryIcon(category)}
                <h2 className="text-lg font-semibold text-foreground">{category}</h2>
                <Badge variant="outline" className="text-xs">
                  {friends.length}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {friends.map((friend, index) => (
                  <Card key={index} className="group hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {friend.name}
                          </CardTitle>
                          <CardDescription className="text-sm font-medium text-primary/80">
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
                    
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {friend.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {friend.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{friend.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Friends;