
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, User, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-ocean-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-ocean-400">GoalSage</h1>
          <p className="text-muted-foreground">Turn your dreams into data-driven plans</p>
        </div>
        
        <Card className="border-2 border-muted/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Log in to your GoalSage account</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Email
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-muted/50 focus:border-primary"
                  required
                />
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
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-ocean-500 hover:from-primary/90 hover:to-ocean-600 transition-all" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log in"}
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
        
        <p className="text-center mt-8 text-xs text-muted-foreground">
          By continuing, you agree to GoalSage's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
