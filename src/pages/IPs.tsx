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
  region: string | null;
  zip_code: string | null;
  isp: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Visitor Analytics
          </h1>
          <p className="text-muted-foreground">Track and monitor your website visitors</p>
          <Badge variant="secondary" className="mt-2">
            Total Visits: {logs.length}
          </Badge>
        </div>

        <div className="grid gap-4">
          {logs.map((log) => (
            <Card 
              key={log.id} 
              className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative overflow-hidden"
            >
              {/* Shiny border effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-lg blur-sm" />
              </div>
              
              <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-mono text-lg">{log.ip_address}</span>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(log.visited_at)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Browser:</span>
                  <Badge variant="secondary">{getBrowserInfo(log.user_agent)}</Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Referrer:</span>
                  <span className="truncate max-w-md">{log.referrer}</span>
                </div>

                {(log.country || log.city || log.region) && (
                  <div className="flex items-center gap-2 text-sm flex-wrap">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Location:</span>
                    <Badge variant="outline">
                      {[log.city, log.region, log.country].filter(Boolean).join(', ')}
                    </Badge>
                    {log.zip_code && (
                      <Badge variant="outline">ZIP: {log.zip_code}</Badge>
                    )}
                  </div>
                )}

                {log.isp && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">ISP:</span>
                    <Badge variant="secondary">{log.isp}</Badge>
                  </div>
                )}

                {log.timezone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Timezone:</span>
                    <span className="text-sm">{log.timezone}</span>
                  </div>
                )}

                {(log.latitude !== null && log.longitude !== null) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="text-sm font-mono">{log.latitude}, {log.longitude}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {logs.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No visitor logs yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IPs;
