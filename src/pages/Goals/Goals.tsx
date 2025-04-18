
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
import { 
  Plus, 
  Target, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Using the same mock data from Dashboard for consistency
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

const Goals = () => {
  const [goals, setGoals] = useState(mockGoals);
  const { toast } = useToast();

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Goal Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Based on your current goals and savings rate, you could reach your first goal by <span className="font-medium">December 2024</span>.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">Optimize Savings</Button>
            <Button variant="outline" size="sm">Adjust Timeline</Button>
            <Button variant="outline" size="sm">Get Investment Tips</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
