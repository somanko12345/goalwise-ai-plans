
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  Plus
} from "lucide-react";

// Mock goals data
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
    returns: 3.2,
    description: "Funding for a 10-day trip across Europe, including flights, accommodation, and spending money.",
    createdAt: "2024-03-15",
    milestones: [
      { date: "2024-05-01", amount: 50000, label: "25% Complete" },
      { date: "2024-09-01", amount: 100000, label: "50% Complete" },
      { date: "2025-01-01", amount: 150000, label: "75% Complete" },
      { date: "2025-05-01", amount: 200000, label: "Goal Complete" }
    ],
    transactions: [
      { date: "2024-03-15", amount: 20000, type: "deposit", note: "Initial deposit" },
      { date: "2024-03-28", amount: 12000, type: "deposit", note: "Monthly contribution" },
      { date: "2024-04-15", amount: 13000, type: "deposit", note: "Extra savings" }
    ]
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
    returns: 2.8,
    description: "Saving for a new MacBook Pro with 16-inch screen and upgraded specs.",
    createdAt: "2024-02-10",
    milestones: [
      { date: "2024-04-01", amount: 37500, label: "25% Complete" },
      { date: "2024-07-01", amount: 75000, label: "50% Complete" },
      { date: "2024-10-01", amount: 112500, label: "75% Complete" },
      { date: "2024-12-15", amount: 150000, label: "Goal Complete" }
    ],
    transactions: [
      { date: "2024-02-10", amount: 50000, type: "deposit", note: "Initial deposit" },
      { date: "2024-02-28", amount: 15000, type: "deposit", note: "Monthly contribution" },
      { date: "2024-03-28", amount: 15000, type: "deposit", note: "Monthly contribution" },
      { date: "2024-04-15", amount: 10000, type: "deposit", note: "Bonus contribution" }
    ]
  }
];

const GoalDetail = () => {
  const { goalId } = useParams();
  const goal = mockGoals.find(g => g.id === goalId);
  
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

  const daysLeft = () => {
    const targetDate = new Date(goal.timeline);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

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
            <p className="text-muted-foreground">{goal.category} Goal • Created on {new Date(goal.createdAt).toLocaleDateString()}</p>
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
            <div className="font-bold text-2xl">₹{goal.current.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">of ₹{goal.target.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm mb-1">Monthly</div>
            <div className="font-bold text-2xl">₹{goal.monthlyContribution.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-2">Contribution</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-muted-foreground text-sm mb-1">Time Left</div>
            <div className="font-bold text-2xl">{daysLeft()} days</div>
            <div className="text-xs text-muted-foreground mt-2">Target: {goal.timeline}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="tips">Tips & Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Details</CardTitle>
              <CardDescription>Information about your financial goal</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{goal.description}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-2">Milestones</h3>
                  <ul className="space-y-2">
                    {goal.milestones.map((milestone, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className={`h-4 w-4 ${goal.current >= milestone.amount ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className={goal.current >= milestone.amount ? 'line-through text-muted-foreground' : ''}>
                          {milestone.label} - {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Additional Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due date: {goal.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{daysLeft()} days remaining</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Average return: {goal.returns}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
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
                {goal.transactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.note}</p>
                      <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'deposit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="projections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Projections</CardTitle>
              <CardDescription>Expected growth based on current savings rate</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <div className="flex items-center justify-center h-[300px] w-full bg-muted/20 rounded-md border border-dashed">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Chart showing projected growth over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
