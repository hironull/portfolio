import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Monitor, ExternalLink, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface VisitorLog {
  id: string;
  ip_address: string;
  user_agent: string;
  referrer: string;
  visited_at: string;
  country: string | null;
  city: string | null;
}

const IPs = () => {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetchLogs();
  }, []);

  const checkAdminAndFetchLogs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to view visitor logs",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Check if user is admin
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (roleError || !roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchLogs();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate("/");
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('visitor_logs')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch visitor logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getBrowserInfo = (userAgent: string) => {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl" />
        <div className="animate-pulse text-xl glass-card p-6 rounded-xl relative z-10">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-8 glass-card p-6 rounded-xl">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Visitor Analytics
          </h1>
          <p className="text-foreground/70">Track and monitor your website visitors</p>
          <Badge className="mt-2 glass-card">
            Total Visits: {logs.length}
          </Badge>
        </div>

        <div className="grid gap-4">
          {logs.map((log) => (
            <Card 
              key={log.id} 
              className="glass-card group transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-foreground" />
                    <span className="font-mono text-lg text-foreground">{log.ip_address}</span>
                  </div>
                  <Badge variant="outline" className="gap-1 glass-card">
                    <Calendar className="w-3 h-3" />
                    {formatDate(log.visited_at)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Monitor className="w-4 h-4 text-foreground/60" />
                  <span className="text-foreground/60">Browser:</span>
                  <Badge className="glass-card">{getBrowserInfo(log.user_agent)}</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4 text-foreground/60" />
                  <span className="text-foreground/60">Referrer:</span>
                  <span className="truncate max-w-md text-foreground/80">{log.referrer}</span>
                </div>

                {(log.country || log.city) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-foreground/60" />
                    <span className="text-foreground/60">Location:</span>
                    <Badge variant="outline" className="glass-card">
                      {[log.city, log.country].filter(Boolean).join(', ')}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {logs.length === 0 && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <Globe className="w-16 h-16 mx-auto text-foreground/40 mb-4" />
              <p className="text-xl text-foreground/60">No visitor logs yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IPs;
