
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import GoalSetup from "./pages/Onboarding/GoalSetup";

// App Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Goals from "./pages/Goals/Goals";
import GoalDetail from "./pages/Goals/GoalDetail";
import GoalCreate from "./pages/Goals/GoalCreate";
import BudgetAnalyzer from "./pages/Budget/BudgetAnalyzer";
import InvestmentSuggestions from "./pages/Investments/InvestmentSuggestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<GoalSetup />} />
            
            {/* Dashboard Routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="goals" element={<Goals />} />
              <Route path="goals/create" element={<GoalCreate />} />
              <Route path="goals/:goalId" element={<GoalDetail />} />
              <Route path="budget" element={<BudgetAnalyzer />} />
              <Route path="investments" element={<InvestmentSuggestions />} />
              {/* Add more routes here */}
            </Route>
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
