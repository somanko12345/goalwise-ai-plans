
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

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
import Insights from "./pages/Insights/Insights";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// This component wraps all routes and provides auth context
const AppRoutes = () => {
  const { user, loading } = useAuth();
  
  return (
    <Routes>
      {/* Redirect root to dashboard if logged in, otherwise to login */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      
      {/* Auth Routes - accessible only when not logged in */}
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/dashboard" />} />
      
      {/* Onboarding - requires authentication */}
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <GoalSetup />
        </ProtectedRoute>
      } />
      
      {/* Dashboard Routes - all require authentication */}
      <Route path="/" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="goals" element={<Goals />} />
        <Route path="goals/create" element={<GoalCreate />} />
        <Route path="goals/:goalId" element={<GoalDetail />} />
        <Route path="budget" element={<BudgetAnalyzer />} />
        <Route path="investments" element={<InvestmentSuggestions />} />
        <Route path="insights" element={<Insights />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
