import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Plus, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface StudentDashboardProps {
  profile: any;
}

const StudentDashboard = ({ profile }: StudentDashboardProps) => {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const { data, error } = await supabase
        .from("grievances")
        .select("*")
        .eq("submitted_by", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGrievances(data || []);
    } catch (error) {
      toast.error("Failed to load grievances");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Clock className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "warning";
      case "in_progress":
        return "info";
      case "resolved":
        return "success";
      case "closed":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Grievance Portal</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {profile.full_name} ({profile.role})
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">My Grievances</h2>
            <p className="text-muted-foreground">Track and manage your submitted grievances</p>
          </div>
          <Button onClick={() => navigate("/submit-grievance")}>
            <Plus className="h-4 w-4 mr-2" />
            Submit New Grievance
          </Button>
        </div>

        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading grievances...
              </CardContent>
            </Card>
          ) : grievances.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You haven't submitted any grievances yet</p>
                <Button onClick={() => navigate("/submit-grievance")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Grievance
                </Button>
              </CardContent>
            </Card>
          ) : (
            grievances.map((grievance) => (
              <Card key={grievance.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {grievance.title}
                        <Badge variant={getStatusColor(grievance.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(grievance.status)}
                          {grievance.status.replace("_", " ")}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="font-mono text-primary font-semibold">
                          {grievance.grievance_id}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{grievance.category}</span>
                        <span>•</span>
                        <span>{format(new Date(grievance.created_at), "MMM d, yyyy")}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{grievance.description}</p>
                  {grievance.resolution_comments && (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                      <p className="text-sm font-medium text-success-foreground mb-1">Resolution:</p>
                      <p className="text-sm">{grievance.resolution_comments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
