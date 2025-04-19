
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  target: z.coerce.number().positive({
    message: "Target amount must be a positive number.",
  }),
  timeline: z.string({
    required_error: "Please specify a timeline.",
  }),
  description: z.string().optional(),
  initialAmount: z.coerce.number().min(0, {
    message: "Initial amount must be greater than or equal to 0.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const GoalCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      target: 0,
      timeline: "",
      description: "",
      initialAmount: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a goal.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse the timeline string to a Date object
      const timelineDate = new Date(data.timeline);
      
      const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        name: data.name,
        category: data.category,
        target: data.target,
        timeline: timelineDate.toISOString(),
        description: data.description || null,
        initial_amount: data.initialAmount,
        current_amount: data.initialAmount // Initially, current amount equals initial amount
      });
      
      if (error) throw error;
      
      toast({
        title: "Goal created",
        description: `${data.name} has been created successfully.`,
      });
      
      setTimeout(() => {
        navigate("/goals");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Failed to create goal",
        description: error.message || "An error occurred while creating your goal.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/goals">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create a New Goal</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal Details</CardTitle>
          <CardDescription>Enter the details for your new financial goal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Trip to Europe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="property">Property</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="vehicle">Vehicle</SelectItem>
                          <SelectItem value="tech">Tech Purchase</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        How much money do you need for this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        When do you want to achieve this goal?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your goal in more detail" 
                        className="min-h-20"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Amount (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      How much have you already saved for this goal?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => navigate("/goals")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Goal"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalCreate;
