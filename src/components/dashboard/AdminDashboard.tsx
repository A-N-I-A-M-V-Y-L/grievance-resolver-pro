import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface AdminDashboardProps {
  profile: any;
}

const AdminDashboard = ({ profile }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState<any[]>([]);
  const [filteredGrievances, setFilteredGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingGrievance, setEditingGrievance] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState("");

  useEffect(() => {
    fetchGrievances();
  }, []);

  useEffect(() => {
    filterGrievances();
  }, [statusFilter, categoryFilter, grievances]);

  const fetchGrievances = async () => {
    try {
      const { data, error } = await supabase
        .from("grievances")
        .select("*, submitter:profiles!submitted_by(full_name, email, user_id_number)")
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

  const filterGrievances = () => {
    let filtered = [...grievances];
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((g) => g.status === statusFilter);
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter((g) => g.category === categoryFilter);
    }
    
    setFilteredGrievances(filtered);
  };

  const handleStatusUpdate = async (grievanceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("grievances")
        .update({ status: newStatus as Database["public"]["Enums"]["grievance_status"] })
        .eq("id", grievanceId);

      if (error) throw error;
      
      toast.success("Status updated successfully");
      fetchGrievances();
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error:", error);
    }
  };

  const handleResolutionSubmit = async (grievanceId: string) => {
    try {
      const { error } = await supabase
        .from("grievances")
        .update({
          resolution_comments: resolutionText,
          status: "resolved",
        })
        .eq("id", grievanceId);

      if (error) throw error;
      
      toast.success("Resolution added successfully");
      setEditingGrievance(null);
      setResolutionText("");
      fetchGrievances();
    } catch (error) {
      toast.error("Failed to add resolution");
      console.error("Error:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const stats = {
    total: grievances.length,
    submitted: grievances.filter((g) => g.status === "submitted").length,
    inProgress: grievances.filter((g) => g.status === "in_progress").length,
    resolved: grievances.filter((g) => g.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {profile.full_name}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Grievances</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Submitted</CardDescription>
              <CardTitle className="text-3xl text-warning">{stats.submitted}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-info">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolved</CardDescription>
              <CardTitle className="text-3xl text-success">{stats.resolved}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <div className="flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="facility">Facility</SelectItem>
                  <SelectItem value="examination">Examination</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {loading ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Loading grievances...
              </CardContent>
            </Card>
          ) : filteredGrievances.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No grievances found with the selected filters
              </CardContent>
            </Card>
          ) : (
            filteredGrievances.map((grievance) => (
              <Card key={grievance.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{grievance.title}</CardTitle>
                      <CardDescription>
                        <span className="font-mono text-primary font-semibold mr-2">
                          {grievance.grievance_id}
                        </span>
                        <span className="capitalize">{grievance.category}</span>
                        <span className="mx-2">•</span>
                        <span>{grievance.submitter?.full_name} ({grievance.submitter?.user_id_number})</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(grievance.created_at), "MMM d, yyyy")}</span>
                      </CardDescription>
                    </div>
                    <Select
                      value={grievance.status}
                      onValueChange={(value) => handleStatusUpdate(grievance.id, value)}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{grievance.description}</p>
                  
                  {grievance.resolution_comments ? (
                    <div className="bg-success/10 border border-success/20 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium mb-1">Resolution:</p>
                      <p className="text-sm">{grievance.resolution_comments}</p>
                    </div>
                  ) : (
                    <div>
                      {editingGrievance === grievance.id ? (
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Enter resolution comments..."
                            value={resolutionText}
                            onChange={(e) => setResolutionText(e.target.value)}
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleResolutionSubmit(grievance.id)}
                            >
                              Submit Resolution
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingGrievance(null);
                                setResolutionText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingGrievance(grievance.id)}
                        >
                          Add Resolution
                        </Button>
                      )}
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

export default AdminDashboard;
