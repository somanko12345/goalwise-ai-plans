
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Lightbulb, TrendingUp, Target, AlertCircle } from "lucide-react";

// Mock insights data
const mockInsights = [
  {
    id: "insight1",
    title: "Savings Potential",
    description: "Based on your spending patterns, you could save an additional ₹3,500 per month by reducing food delivery expenses.",
    type: "opportunity",
    category: "savings"
  },
  {
    id: "insight2",
    title: "Goal Progress",
    description: "You're 15% ahead on your MacBook Pro goal! At this rate, you'll reach it 2 months earlier than planned.",
    type: "achievement",
    category: "goals"
  },
  {
    id: "insight3",
    title: "Market Update",
    description: "Market volatility has increased by 12% this month. Consider diversifying your investments for your long-term goals.",
    type: "alert",
    category: "investment"
  },
  {
    id: "insight4",
    title: "Spending Pattern",
    description: "Your entertainment expenses have increased by 22% compared to last month. This might impact your Europe trip goal timeline.",
    type: "warning",
    category: "budget"
  }
];

const Insights = () => {
  const { user } = useAuth();
  const [insights] = useState(mockInsights);

  const getIconForInsightType = (type: string) => {
    switch (type) {
      case "opportunity":
        return <Lightbulb className="h-5 w-5 text-blue-600" />;
      case "achievement":
        return <Target className="h-5 w-5 text-green-600" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <TrendingUp className="h-5 w-5 text-primary" />;
    }
  };

  const getBackgroundForInsightType = (type: string) => {
    switch (type) {
      case "opportunity":
        return "bg-blue-100";
      case "achievement":
        return "bg-green-100";
      case "alert":
        return "bg-amber-100";
      case "warning":
        return "bg-red-100";
      default:
        return "bg-primary/10";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
        <p className="text-muted-foreground">
          Personalized financial insights and recommendations based on your goals and spending patterns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <Card key={insight.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${getBackgroundForInsightType(insight.type)}`}>
                  {getIconForInsightType(insight.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {insight.description}
                  </p>
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {insight.category}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {insights.length === 0 && (
          <Card className="col-span-2 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Lightbulb className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-center mb-1">No insights yet</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                As you use GoalSage more, we'll provide personalized financial insights here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Manager</CardTitle>
          <CardDescription>View and manage user data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium">Active User</h3>
            <div className="p-4 border rounded-md">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>ID:</strong> {user?.id}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              For full backend functionality to manage all users, integrate with Supabase or another backend service.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;

