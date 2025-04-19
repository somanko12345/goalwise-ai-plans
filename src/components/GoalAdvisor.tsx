
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SparklesIcon, RefreshCw, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface GoalAdvisorProps {
  goalData: any;
}

export default function GoalAdvisor({ goalData }: GoalAdvisorProps) {
  const [advice, setAdvice] = useState<string | null>(null);
  const [calculations, setCalculations] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getAdvice = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('financial-advisor', {
        body: { goalData }
      });
      
      if (error) throw error;
      
      setAdvice(data.advice);
      setCalculations(data.calculations);
    } catch (err: any) {
      console.error("Error getting financial advice:", err);
      setError("Could not fetch financial advice. Please try again later.");
      
      toast({
        title: "Error fetching advice",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format financial numbers with commas
  const formatCurrency = (amount: number) => {
    return "₹" + amount.toLocaleString('en-IN');
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-primary" />
            <CardTitle>Financial Advisor</CardTitle>
          </div>
          {calculations && (
            <Badge variant={calculations.isGoalFeasible ? "outline" : "destructive"}>
              {calculations.isGoalFeasible ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {calculations.isGoalFeasible ? "Feasible" : "Challenging"}
            </Badge>
          )}
        </div>
        <CardDescription>
          Get AI-powered insights and advice to help reach your goal
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : error ? (
          <div className="p-4 bg-destructive/10 rounded-md text-destructive">
            {error}
          </div>
        ) : !advice ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <SparklesIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="mb-2 text-muted-foreground">
              Click below to get personalized financial advice for this goal
            </p>
          </div>
        ) : (
          <div>
            {calculations && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Savings Needed</div>
                  <div className="font-bold text-lg">{formatCurrency(calculations.monthlyContribution)}</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Time Remaining</div>
                  <div className="font-bold text-lg">{calculations.monthsLeft} months</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Still Needed</div>
                  <div className="font-bold text-lg">{formatCurrency(calculations.amountNeeded)}</div>
                </div>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div className="prose prose-sm max-w-none">
              {advice.split('\n').map((paragraph, i) => (
                <p key={i} className={paragraph.startsWith('•') ? 'flex items-start gap-2' : ''}>
                  {paragraph.startsWith('•') && <ArrowRight className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />}
                  <span>{paragraph.replace('•', '')}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          onClick={getAdvice} 
          disabled={loading}
          className="w-full"
          variant={advice ? "outline" : "default"}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : advice ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Advice
            </>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4 mr-2" />
              Get Financial Advice
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
