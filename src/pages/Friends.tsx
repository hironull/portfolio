import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Heart, Zap, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";

const Friends = () => {
  const friendsData = {
    "Best Friends": [
      {
        name: "Azuren",
        title: "Discord server Desiger",
        skills: ["Management", "Aesthetic", "Embeds"],
        status: "Available"
      },
      {
        name: "ZenpaiZombie", 
        title: "Founder @ StrelixCloud",
        skills: ["Proxmox", "Kvm", "Vitrualiozation"],
        status: "Busy"
      }
    ],
    "Bros": [
      {
        name: "Nkash",
        title: "Vps Specialist",
        skills: ["Networking", "Kvm", "Docker"],
        status: "Offline"
      },
      {
        name: "Exo1tap ",
        title: "Idk", 
        skills: ["Java", "Minecraft", "Mods"],
        status: "Available"
      },
      {
        name: "Spicy mango",
        title: "Minecraft server developer",
        skills: ["Java", "Papermc"],
        status: "Busy"
      }
    ],
    "Special Persons": [
      {
        name: "Aegis",
        title: "Bot And Backend Developer",
        skills: ["Python", "Nodejs", "Mangodb"],
        status: "Busy"
      },
      {
        name: "Miorin",
        title: "Hacker!!",
        skills: ["Python", "Machine Learning", "TensorFlow"],
        status: "Available"
      }
    ],
    "Friends": [
      {
        name: "Alya",
        title: "Graphic Desiger",
        skills: ["Proxmox", "Kvm", "Docker"],
        status: "Busy"
      },
      {
        name: "Leo",
        title: "Discord Bot developer",
        skills: ["Nodejs", "JavaScript", "Python"],
        status: "Idle"
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
