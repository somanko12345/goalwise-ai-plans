
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  ArrowRight,
  Plane,
  Home,
  Laptop,
  Car,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Progress } from "@/components/ui/progress";

// Import goal types
type GoalType = "travel" | "property" | "education" | "vehicle" | "tech" | "retirement" | "custom";

interface GoalTypeOption {
  value: GoalType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const goalTypes: GoalTypeOption[] = [
  { 
    value: "travel", 
    label: "Travel", 
    icon: Plane,
    description: "Plan your dream vacation or adventure trip"
  },
  { 
    value: "property", 
    label: "Property", 
    icon: Home,
    description: "Save for a home down payment or property investment"
  },
  { 
    value: "education", 
    label: "Education", 
    icon: GraduationCap,
    description: "Fund education or professional development"
  },
  { 
    value: "vehicle", 
    label: "Vehicle", 
    icon: Car,
    description: "Purchase a car or other vehicle"
  },
  { 
    value: "tech", 
    label: "Tech Purchase", 
    icon: Laptop,
    description: "Save for electronic devices or tech products"
  }
];

// Defining the validation schema for the goal setup form
const goalFormSchema = z.object({
  goalType: z.string({
    required_error: "Please select a goal type",
  }),
  goalName: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  targetAmount: z.coerce.number().positive({
    message: "Target amount must be a positive number",
  }),
  timeline: z.coerce.number().int().positive({
    message: "Timeline must be a positive number",
  }),
  timelineUnit: z.string({
    required_error: "Please select a timeline unit",
  }),
  startingAmount: z.coerce.number().min(0, {
    message: "Starting amount must be greater than or equal to 0",
  }),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const GoalSetup = () => {
  const [step, setStep] = useState(0);
  const [savedValues, setSavedValues] = useState<GoalFormValues | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const totalSteps = 3;

  // Form definition
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: savedValues || {
      goalType: "",
      goalName: "",
      targetAmount: 0,
      timeline: 0,
      timelineUnit: "months",
      startingAmount: 0,
    },
  });

  // Handle goal type selection
  const handleGoalTypeSelect = (goalType: GoalType) => {
    form.setValue("goalType", goalType);
    
    // Set default goal name based on type
    const selectedGoal = goalTypes.find(g => g.value === goalType);
    if (selectedGoal) {
      form.setValue("goalName", selectedGoal.label + " Goal");
    }
    
    // Move to next step
    nextStep();
  };

  // Handle next step
  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  // Handle previous step
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle form submission
  const onSubmit = (data: GoalFormValues) => {
    setSavedValues(data);
    
    // In a real app, save this to the backend
    // For now, we'll just log and navigate to the dashboard
    console.log("Goal created:", data);
    
    toast({
      title: "Goal created successfully!",
      description: "Your financial plan is being prepared.",
    });
    
    // Redirect to dashboard after short delay
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  // Render step content
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">What are you saving for?</h2>
              <p className="text-muted-foreground">Select the type of goal you want to achieve</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalTypes.map((goalType) => (
                <div
                  key={goalType.value}
                  className="cursor-pointer"
                  onClick={() => handleGoalTypeSelect(goalType.value)}
                >
                  <div className={`flex items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors ${
                    form.getValues("goalType") === goalType.value 
                      ? "border-primary bg-primary/10" 
                      : "border-border"
                  }`}>
                    <div className={`mr-4 p-2 rounded-full ${
                      form.getValues("goalType") === goalType.value 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <goalType.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{goalType.label}</h3>
                      <p className="text-sm text-muted-foreground">{goalType.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="cursor-pointer"
                onClick={() => handleGoalTypeSelect("custom")}
              >
                <div className={`flex items-center p-4 rounded-lg border border-dashed hover:border-primary hover:bg-primary/5 transition-colors ${
                  form.getValues("goalType") === "custom" 
                    ? "border-primary bg-primary/10" 
                    : "border-border"
                }`}>
                  <div className={`mr-4 p-2 rounded-full ${
                    form.getValues("goalType") === "custom" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Custom Goal</h3>
                    <p className="text-sm text-muted-foreground">Create your own custom financial goal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Goal Details</h2>
              <p className="text-muted-foreground">Let's name your goal and set a target amount</p>
            </div>
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="goalName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="My Dream Trip" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="200000" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How much money do you need for this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      form.trigger(["goalName", "targetAmount"]).then((isValid) => {
                        if (isValid) nextStep();
                      });
                    }}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">Timeline & Starting Amount</h2>
              <p className="text-muted-foreground">When do you want to achieve this goal?</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Timeline</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="12" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="timelineUnit"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Unit</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="months">Months</SelectItem>
                            <SelectItem value="years">Years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="startingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How much have you already saved for this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between pt-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit">
                    Create Goal
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set Up Your First Goal</h1>
          <p className="text-muted-foreground">Let's create a personalized plan to achieve your financial goals</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Goal Setup</CardTitle>
            <Progress value={((step + 1) / totalSteps) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Goal Type</span>
              <span>Goal Details</span>
              <span>Timeline</span>
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoalSetup;
