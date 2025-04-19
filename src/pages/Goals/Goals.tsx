import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Target, 
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Goal {
  id: string;
  name: string;
  target: number;
  current_amount: number;
  timeline: string;
  category: string;
  progress: number;
  status: "on-track" | "ahead" | "behind";
  initial_amount: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  description: string | null;
}

const calculateProgress = (current: number, target: number) => {
  return Math.min(Math.round((current / target) * 100), 100);
};

const calculateStatus = (current: number, target: number, timeline: Date): "on-track" | "ahead" | "behind" => {
  const progress = calculateProgress(current, target);
  const now = new Date();
  const totalDuration = timeline.getTime() - new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime();
  const elapsed = now.getTime() - (timeline.getTime() - totalDuration);
  const expectedProgress = Math.min(Math.round((elapsed / totalDuration) * 100), 100);

  if (progress >= expectedProgress + 10) return "ahead";
  if (progress <= expectedProgress - 10) return "behind";
  return "on-track";
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        const processedGoals = data.map(goal => {
          const timelineDate = new Date(goal.timeline);
          const progress = calculateProgress(goal.current_amount, goal.target);
          const status = calculateStatus(goal.current_amount, goal.target, timelineDate);

          return {
            ...goal,
            progress,
            status
          } as Goal;
        });

        setGoals(processedGoals);
      } catch (error: any) {
        console.error("Error fetching goals:", error);
        toast({
          title: "Could not load goals",
          description: error.message || "An error occurred while loading your goals.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user, toast]);

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Target className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="font-medium text-center mb-1">Authentication Required</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Please log in to view and manage your goals
          </p>
          <Button onClick={() => navigate("/login")}>
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Goals</h1>
          <p className="text-muted-foreground">
            Track and manage your savings goals.
          </p>
        </div>
        <Link to="/goals/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Create Goal
          </Button>
        </Link>
      </div>
      
      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{goal.name}</CardTitle>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  goal.status === "on-track" ? "bg-green-100 text-green-800" :
                  goal.status === "ahead" ? "bg-blue-100 text-blue-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  {goal.status === "on-track" ? "On Track" : 
                  goal.status === "ahead" ? "Ahead" : "Behind"}
                </span>
              </div>
              <CardDescription>{goal.category} • Due by {new Date(goal.timeline).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">₹{goal.current_amount.toLocaleString()} saved</span>
                  <span>₹{goal.target.toLocaleString()} goal</span>
                </div>
                <Separator />
                <div className="flex justify-between pt-2">
                  <div>
                    <p className="text-sm font-medium">₹{goal.initial_amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Initial amount</p>
                  </div>
                  <Link to={`/goals/${goal.id}`}>
                    <Button variant="ghost" size="sm">
                      Details <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {goals.length === 0 && (
          <Card className="border-dashed col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Target className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-center mb-1">No goals yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Set up your first financial goal to start planning
              </p>
              <Link to="/goals/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Create Goal
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Action Card */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Goal Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Based on your current goals and savings rate, you could reach your first goal by <span className="font-medium">
              {goals.length > 0 ? new Date(goals[0].timeline).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "December 2024"}
            </span>.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Optimize Savings</Button>
              <Button variant="outline" size="sm">Adjust Timeline</Button>
              <Button variant="outline" size="sm">Get Investment Tips</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Goals;
