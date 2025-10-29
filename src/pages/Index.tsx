import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, BarChart3 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">College Grievance System</span>
          </div>
          <Button onClick={() => navigate("/auth")}>Login / Sign Up</Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Voice Your Concerns, Drive Change
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive platform for students and faculty to submit, track, and resolve grievances efficiently.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Submit Grievances</h3>
            <p className="text-muted-foreground">
              Easy-to-use forms with category-specific fields to ensure your concerns are properly documented.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Users className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your grievances with unique IDs and real-time status updates from submission to resolution.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Admin panel with comprehensive analytics to identify trends and improve institutional processes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
