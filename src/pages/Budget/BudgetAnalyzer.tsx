
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { ArrowRight, Calculator, Check, Edit, Plus, Save, Sparkles, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define schema for income form
const incomeFormSchema = z.object({
  salary: z.coerce.number().min(0),
  investments: z.coerce.number().min(0),
  other: z.coerce.number().min(0),
});

// Define schema for expenses form
const expenseFormSchema = z.object({
  housing: z.coerce.number().min(0),
  food: z.coerce.number().min(0),
  transportation: z.coerce.number().min(0),
  utilities: z.coerce.number().min(0),
  entertainment: z.coerce.number().min(0),
  shopping: z.coerce.number().min(0),
  healthcare: z.coerce.number().min(0),
  personal: z.coerce.number().min(0),
  debt: z.coerce.number().min(0),
  other: z.coerce.number().min(0),
});

// Mock insights for demonstration
const mockInsights = [
  {
    id: "insight1",
    type: "opportunity",
    title: "Reduce food expenses",
    description: "You're spending 25% more on food than similar income groups. Consider meal planning to save ₹3,500 monthly.",
    impact: 3500,
    category: "food"
  },
  {
    id: "insight2",
    type: "strength",
    title: "Housing costs optimized",
    description: "Your housing costs are well managed at 22% of income, below the recommended 30%.",
    category: "housing"
  },
  {
    id: "insight3",
    type: "recommendation",
    title: "Entertainment budget",
    description: "You could allocate ₹2,000 from entertainment to your Europe trip goal to stay on track.",
    impact: 2000,
    category: "entertainment"
  }
];

const COLORS = ['#1D99B7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1'];

const BudgetAnalyzer = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [insights] = useState(mockInsights);

  // Default income and expenses data
  const [incomeData, setIncomeData] = useState({
    salary: 85000,
    investments: 5000,
    other: 2000,
  });

  const [expensesData, setExpensesData] = useState({
    housing: 20000,
    food: 15000,
    transportation: 8000,
    utilities: 5000,
    entertainment: 7000,
    shopping: 6000,
    healthcare: 3000,
    personal: 4000,
    debt: 10000,
    other: 2000,
  });

  // Setup forms
  const incomeForm = useForm<z.infer<typeof incomeFormSchema>>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: incomeData,
  });

  const expensesForm = useForm<z.infer<typeof expenseFormSchema>>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: expensesData,
  });

  // Handle form submission
  const onSubmitIncome = (data: z.infer<typeof incomeFormSchema>) => {
    setIncomeData({
      salary: data.salary,
      investments: data.investments,
      other: data.other
    });
    setIsEditing(false);
    toast({
      title: "Income updated",
      description: "Your income information has been saved.",
    });
  };

  const onSubmitExpenses = (data: z.infer<typeof expenseFormSchema>) => {
    setExpensesData({
      housing: data.housing,
      food: data.food,
      transportation: data.transportation,
      utilities: data.utilities,
      entertainment: data.entertainment,
      shopping: data.shopping,
      healthcare: data.healthcare,
      personal: data.personal,
      debt: data.debt,
      other: data.other
    });
    setIsEditing(false);
    toast({
      title: "Expenses updated",
      description: "Your expense information has been saved.",
    });
  };

  // Calculate totals
  const totalIncome = Object.values(incomeData).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expensesData).reduce((sum, val) => sum + val, 0);
  const netCashflow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((netCashflow) / totalIncome) * 100 : 0;

  // Format data for charts
  const pieChartData = Object.entries(expensesData).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value
  }));

  const barChartData = [
    { name: 'Income vs Expenses', Income: totalIncome, Expenses: totalExpenses }
  ];

  // Format category names for display
  const formatCategory = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze your income and expenses to find savings opportunities.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className={netCashflow >= 0 ? "border-green-200" : "border-red-200"}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cashflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netCashflow >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{netCashflow.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Income minus expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Percentage of income saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Potential Optimizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{insights.reduce((sum, insight) => sum + (insight.impact || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Identified monthly savings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>
                Visual breakdown of your monthly finances
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-80">
                  <h3 className="text-sm font-medium mb-2 text-center">Income vs Expenses</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                      data={barChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="Income" fill="#10B981" />
                      <Bar dataKey="Expenses" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <h3 className="text-sm font-medium mb-2 text-center">Expense Breakdown</h3>
                  <ResponsiveContainer width="100%" height="90%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Summary</h3>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit Budget
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                    <p className="font-medium">₹{totalIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                    <p className="font-medium">₹{totalExpenses.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available for Goals</p>
                    <p className="font-medium">₹{Math.max(0, netCashflow).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Income Tab */}
        <TabsContent value="income">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Income Details</CardTitle>
                  <CardDescription>
                    Manage your monthly income sources
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...incomeForm}>
                  <form onSubmit={incomeForm.handleSubmit(onSubmitIncome)} className="space-y-4">
                    <FormField
                      control={incomeForm.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input {...field} className="pl-7" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={incomeForm.control}
                      name="investments"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Income</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input {...field} className="pl-7" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={incomeForm.control}
                      name="other"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Other Income</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                              <Input {...field} className="pl-7" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  {Object.entries(incomeData).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center py-2 border-b">
                      <div className="font-medium">{formatCategory(category)}</div>
                      <div>₹{amount.toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-bold">
                    <div>Total Income</div>
                    <div>₹{totalIncome.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Expenses Tab */}
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Expense Details</CardTitle>
                  <CardDescription>
                    Manage your monthly expenses by category
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...expensesForm}>
                  <form onSubmit={expensesForm.handleSubmit(onSubmitExpenses)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(expensesData).map(([category]) => (
                        <FormField
                          key={category}
                          control={expensesForm.control}
                          name={category as keyof typeof expensesData}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{formatCategory(category)}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                                  <Input {...field} className="pl-7" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  {Object.entries(expensesData).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center py-2 border-b">
                      <div className="font-medium">{formatCategory(category)}</div>
                      <div>₹{amount.toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center py-2 font-bold">
                    <div>Total Expenses</div>
                    <div>₹{totalExpenses.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* AI Insights Tab */}
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-accent" />
                AI Budget Insights
              </CardTitle>
              <CardDescription>
                Personalized recommendations to optimize your budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <Card key={insight.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      insight.type === 'opportunity' ? 'bg-blue-500' :
                      insight.type === 'strength' ? 'bg-green-500' :
                      'bg-amber-500'
                    }`} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                        {insight.impact && (
                          <div className="bg-muted px-3 py-1 rounded-full text-xs font-medium">
                            Potential saving: ₹{insight.impact.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    Insights based on your current budget and spending patterns
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Calculator className="mr-2 h-4 w-4" />
                    Run Full Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetAnalyzer;
