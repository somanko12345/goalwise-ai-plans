
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, User, Lock, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to GoalSage!",
        variant: "default"
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-blue-50 to-ocean-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-primary/20 to-ocean-400/20 rounded-full mb-4">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-ocean-400 to-blue-600">GoalSage</h1>
          <p className="text-muted-foreground text-lg">Turn your dreams into data-driven plans</p>
        </div>
        
        <Card className="border-2 border-muted/30 shadow-xl overflow-hidden">
          <div className="absolute h-2 w-full bg-gradient-to-r from-primary via-ocean-400 to-blue-600"></div>
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">Log in to your GoalSage account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Email
                </label>
                <div className="relative">
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-muted/50 focus:border-primary pr-10"
                    required
                  />
                  {email.includes('@') && <CheckCircle className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-muted/50 focus:border-primary"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="rounded border-muted/50 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me for 30 days
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-ocean-500 hover:from-primary/90 hover:to-ocean-600 transition-all h-12 text-base"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Log in
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to GoalSage's Terms of Service and Privacy Policy.
          </p>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <Button variant="outline" size="sm" className="text-xs">Privacy Policy</Button>
          <Button variant="outline" size="sm" className="text-xs">Terms of Service</Button>
          <Button variant="outline" size="sm" className="text-xs">Contact Us</Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
