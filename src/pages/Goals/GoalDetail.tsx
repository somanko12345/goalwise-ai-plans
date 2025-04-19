
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Settings,
  TrendingUp,
  Plus,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import GoalAdvisor from "@/components/GoalAdvisor";
import { useToast } from "@/hooks/use-toast";

const GoalDetail = () => {
  const { goalId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGoal = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("goals")
          .select("*")
          .eq("id", goalId)
          .eq("user_id", user.id)
          .single();
          
        if (error) throw error;
        
        // Calculate progress percentage
        const progressPercent = data.target > 0 
          ? Math.min(Math.round((data.current_amount / data.target) * 100), 100)
          : 0;
          
        // Determine goal status based on timeline and progress
        const targetDate = new Date(data.timeline);
        const today = new Date();
        const totalDays = (targetDate.getTime() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24);
        const daysElapsed = (today.getTime() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24);
        const expectedProgress = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;
        
        let status: "on-track" | "ahead" | "behind" = "on-track";
        if (progressPercent > expectedProgress + 5) {
          status = "ahead";
        } else if (progressPercent < expectedProgress - 5) {
          status = "behind";
        }
        
        setGoal({
          ...data,
          progress: progressPercent,
          status
        });
      } catch (error: any) {
        console.error("Error fetching goal:", error);
        toast({
          title: "Error loading goal",
          description: error.message || "Could not load goal details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoal();
  }, [goalId, user, toast]);

  const daysLeft = () => {
    if (!goal) return 0;
    const targetDate = new Date(goal.timeline);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!goal) {
    return (
      <Card className="m-auto max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <h2 className="text-xl font-semibold mb-2">Goal Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested goal could not be found.</p>
          <Link to="/goals">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Goals
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/goals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{goal.name}</h1>
            <p className="text-muted-foreground">{goal.category} Goal • Created on {new Date(goal.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" /> Edit Goal
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm mb-1">Progress</div>
            <div className="font-bold text-2xl">{goal.progress}%</div>
            <Progress value={goal.progress} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm mb-1">Saved</div>
            <div className="font-bold text-2xl">₹{goal.current_amount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">of ₹{goal.target.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm mb-1">Status</div>
            <div className="font-bold text-2xl capitalize">
              {goal.status === "ahead" && <span className="text-green-600">{goal.status}</span>}
              {goal.status === "on-track" && <span className="text-blue-600">{goal.status}</span>}
              {goal.status === "behind" && <span className="text-amber-600">{goal.status}</span>}
            </div>
            <div className="text-xs text-muted-foreground mt-2">Based on timeline</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm mb-1">Time Left</div>
            <div className="font-bold text-2xl">{daysLeft()} days</div>
            <div className="text-xs text-muted-foreground mt-2">Target: {new Date(goal.timeline).toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="advisor">AI Advisor</TabsTrigger>
          <TabsTrigger value="tips">Tips & Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Details</CardTitle>
              <CardDescription>Information about your financial goal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{goal.description || "No description provided."}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Goal Milestones</h3>
                  <ul className="space-y-2">
                    {[25, 50, 75, 100].map((milestone) => {
                      const amount = (goal.target * (milestone / 100));
                      const isComplete = goal.current_amount >= amount;
                      
                      return (
                        <li key={milestone} className="flex items-center gap-2">
                          <CheckCircle className={`h-4 w-4 ${isComplete ? 'text-green-500' : 'text-gray-300'}`} />
                          <span className={isComplete ? 'line-through text-muted-foreground' : ''}>
                            {milestone}% Complete - ₹{amount.toLocaleString()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Additional Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due date: {new Date(goal.timeline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{daysLeft()} days remaining</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Initial amount: ₹{goal.initial_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <span className="text-sm text-muted-foreground">Last updated: {new Date(goal.updated_at).toLocaleDateString()}</span>
              <Button variant="outline" size="sm">Download PDF Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Record of contributions and withdrawals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center h-32 border border-dashed rounded-md">
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advisor" className="space-y-4">
          <GoalAdvisor goalData={goal} />
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tips & Recommendations</CardTitle>
              <CardDescription>Personalized insights to help you reach your goal faster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Increase your monthly contributions</h3>
                <p className="text-blue-700 text-sm">Adding just ₹2,000 more per month would help you reach your goal 2 months earlier.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-800 mb-2">Consider a higher-yield investment</h3>
                <p className="text-green-700 text-sm">Moving a portion of your savings to a fixed deposit could increase your returns by 1-2%.</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800 mb-2">Review your expenses</h3>
                <p className="text-amber-700 text-sm">Based on your budget, you could potentially save an additional ₹3,000/month by reducing dining out expenses.</p>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full">Get More Personalized Tips</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalDetail;
