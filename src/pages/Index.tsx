
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ChevronRight, Target, TrendingUp, Bell, LineChart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-background">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Turn your dreams into <span className="text-primary">data-driven plans</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            GoalSage helps you create personalized financial plans to achieve your goals with AI-powered insights and guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <Button size="lg" className="px-8 font-medium">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8">
                Log in
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How GoalSage Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes financial planning simple and achievable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Goal Setup Wizard</h3>
              <p className="text-muted-foreground mb-4">
                Define your goals with our guided setup. Whether it's a Europe trip or a new laptop, we've got you covered.
              </p>
              <div className="flex items-center text-primary">
                <span className="font-medium">Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Budget Analyzer</h3>
              <p className="text-muted-foreground mb-4">
                Our AI analyzes your finances and recommends optimal savings plans tailored to your spending patterns.
              </p>
              <div className="flex items-center text-primary">
                <span className="font-medium">Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Nudges & Alerts</h3>
              <p className="text-muted-foreground mb-4">
                Stay motivated with personalized reminders and insights to keep your goals on track.
              </p>
              <div className="flex items-center text-primary">
                <span className="font-medium">Learn more</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to achieve your financial goals?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of users who are turning their dreams into reality with GoalSage.
          </p>
          <Link to="/signup">
            <Button size="lg" className="px-8 font-medium">
              Start Your Journey <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              <span className="font-bold text-lg">GoalSage</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} GoalSage. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
