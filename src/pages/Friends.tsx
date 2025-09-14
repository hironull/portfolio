import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Heart, Zap, Star, Crown, MessageCircle, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Friends = () => {
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);

  const copyDiscordUsername = (username: string, displayName: string) => {
    navigator.clipboard.writeText(username);
    setCopiedUsername(displayName);
    toast({
      title: "Copied!",
      description: `${displayName}'s Discord username copied to clipboard`,
    });
    setTimeout(() => setCopiedUsername(null), 2000);
  };

  const friendsData = {
    "Best Friends": [
      {
        name: "Azuren",
        title: "Discord server Designer",
        skills: ["Management", "Aesthetic", "Embeds"],
        status: "Available",
        discord: "azuren.dev",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=azuren`
      },
      {
        name: "ZenpaiZombie", 
        title: "Founder @ StrelixCloud",
        skills: ["Proxmox", "KVM", "Virtualization"],
        status: "Busy",
        discord: "zenpaizombie",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=zombie`
      }
    ],
    "Bros": [
      {
        name: "Nkash",
        title: "VPS Specialist",
        skills: ["Networking", "KVM", "Docker"],
        status: "Offline",
        discord: "nkash.tech",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=nkash`
      },
      {
        name: "Exo1tap",
        title: "Minecraft Developer", 
        skills: ["Java", "Minecraft", "Mods"],
        status: "Available",
        discord: "exo1tap",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=exo`
      },
      {
        name: "Spicy mango",
        title: "Minecraft Server Developer",
        skills: ["Java", "PaperMC"],
        status: "Busy",
        discord: "spicymango",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=mango`
      }
    ],
    "Special Persons": [
      {
        name: "Aegis",
        title: "Bot & Backend Developer",
        skills: ["Python", "Node.js", "MongoDB"],
        status: "Busy",
        discord: "aegis.dev",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=aegis`
      },
      {
        name: "Miorin",
        title: "Security Researcher",
        skills: ["Python", "Machine Learning", "TensorFlow"],
        status: "Available",
        discord: "miorin.ai",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=miorin`
      }
    ],
    "Friends": [
      {
        name: "Alya",
        title: "Graphic Designer",
        skills: ["Photoshop", "Illustrator", "UI Design"],
        status: "Busy",
        discord: "alya.design",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alya`
      },
      {
        name: "Leo",
        title: "Discord Bot Developer",
        skills: ["Node.js", "JavaScript", "Python"],
        status: "Idle",
        discord: "leo.codes",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=leo`
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
      {/* Header with Description */}
      <header className="border-b border-border/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Network</h1>
              <p className="text-foreground/70 mt-1">Professional connections & amazing friends</p>
            </div>
            <Link to="/">
              <Button variant="outline" size="sm">← Back</Button>
            </Link>
          </div>
          
          {/* Network Description */}
          <div className="max-w-3xl">
            <p className="text-foreground/80 leading-relaxed">
              Welcome to my professional network! These are the incredible individuals I've had the privilege to work, 
              collaborate, and build friendships with. From talented developers and designers to innovative entrepreneurs 
              and creative minds - each person here has contributed something valuable to my journey in tech.
            </p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend, index) => (
                  <Card key={index} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/50 hover:border-primary/50 hover:bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                          <AvatarImage 
                            src={friend.avatar} 
                            alt={friend.name}
                            className="group-hover:scale-110 transition-transform duration-300"
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {friend.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <CardTitle className="text-base group-hover:text-primary transition-colors duration-200 truncate">
                                {friend.name}
                              </CardTitle>
                              <CardDescription className="text-sm font-medium text-primary/80 line-clamp-1">
                                {friend.title}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant={friend.status === "Available" ? "default" : friend.status === "Busy" ? "destructive" : "secondary"}
                              className="text-xs shrink-0 ml-2"
                            >
                              {friend.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {friend.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                            {skill}
                          </Badge>
                        ))}
                        {friend.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                            +{friend.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 group/btn"
                        onClick={() => copyDiscordUsername(friend.discord, friend.name)}
                      >
                        <MessageCircle className="w-3 h-3 mr-2 group-hover/btn:scale-110 transition-transform" />
                        {copiedUsername === friend.name ? (
                          <>
                            <Copy className="w-3 h-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>@{friend.discord}</>
                        )}
                      </Button>
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
