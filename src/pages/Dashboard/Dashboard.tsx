
import { useState } from "react";
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
import { useAuth } from "@/context/AuthContext";
import { 
  Activity, 
  AlertCircle, 
  ArrowRight, 
  Bell, 
  DollarSign,
  Lightbulb,
  LineChart, 
  Plus,
  Target, 
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data for the dashboard
const mockGoals = [
  {
    id: "goal1",
    name: "Trip to Europe",
    target: 200000,
    current: 45000,
    timeline: "May 2025",
    category: "Travel",
    progress: 22.5,
    status: "on-track",
    monthlyContribution: 12000,
    returns: 3.2
  },
  {
    id: "goal2",
    name: "MacBook Pro",
    target: 150000,
    current: 90000,
    timeline: "Dec 2024",
    category: "Tech",
    progress: 60,
    status: "ahead",
    monthlyContribution: 15000,
    returns: 2.8
  }
];

const mockNudges = [
  {
    id: "nudge1",
    type: "tip",
    title: "Save more this month",
    description: "You're ₹3,000 behind your Europe trip goal for this month. Try cutting back on food delivery.",
    date: new Date(),
    category: "savings"
  },
  {
    id: "nudge2",
    type: "alert",
    title: "Market opportunity",
    description: "Gold prices are down 2%. Consider adding some to your portfolio for your long-term goals.",
    date: new Date(),
    category: "investment"
  },
  {
    id: "nudge3",
    type: "achievement",
    title: "Milestone reached!",
    description: "You've saved 60% of your MacBook Pro goal. Keep up the great work!",
    date: new Date(),
    category: "milestone"
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nudges, setNudges] = useState(mockNudges);
  const [goals] = useState(mockGoals);

  const dismissNudge = (id: string) => {
    setNudges(nudges.filter(nudge => nudge.id !== id));
    toast({
      title: "Nudge dismissed",
      description: "You won't see this nudge again."
    });
  };
  
  // Get time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const totalSavings = goals.reduce((sum, goal) => sum + goal.current, 0);
  const monthlyContributions = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}, {user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">
          Here's the latest on your financial goals and progress.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all your goals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contributions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{monthlyContributions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total monthly allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">{goals.length === 1 ? "Goal" : "Goals"} in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investment Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.1%</div>
            <p className="text-xs text-muted-foreground">Average return rate</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Goals Section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Goals</h2>
          <Link to="/goals/create">
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" /> Add Goal
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 mt-4">
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
                <CardDescription>{goal.category} • Due by {goal.timeline}</CardDescription>
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
                    <span className="text-muted-foreground">₹{goal.current.toLocaleString()} saved</span>
                    <span>₹{goal.target.toLocaleString()} goal</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between pt-2">
                    <div>
                      <p className="text-sm font-medium">₹{goal.monthlyContribution.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Monthly contribution</p>
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
            <Card className="border-dashed">
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
      </div>
      
      {/* Nudges & Alerts Section */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Nudges & Insights</h2>
          <Button size="sm" variant="ghost">
            <Bell className="h-4 w-4 mr-1" /> Settings
          </Button>
        </div>
        
        <div className="grid gap-4 mt-4">
          {nudges.map((nudge) => (
            <Card key={nudge.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    nudge.type === 'tip' ? 'bg-blue-100' : 
                    nudge.type === 'alert' ? 'bg-amber-100' : 
                    'bg-green-100'
                  }`}>
                    {nudge.type === 'tip' && <Lightbulb className="h-5 w-5 text-blue-600" />}
                    {nudge.type === 'alert' && <AlertCircle className="h-5 w-5 text-amber-600" />}
                    {nudge.type === 'achievement' && <Target className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{nudge.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {nudge.description}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => dismissNudge(nudge.id)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {nudges.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex items-center justify-center p-6">
                <p className="text-muted-foreground text-sm">No new insights right now. Check back later!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
