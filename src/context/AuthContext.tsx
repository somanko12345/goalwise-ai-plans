
import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  id: string;
  email: string;
  name: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we're just mocking authentication
    // In a real app, you would call an API
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would validate credentials with your backend
    // Simple validation for demo
    if (email && password) {
      const user = { id: "user-123", email, name: email.split("@")[0] };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } else {
      throw new Error("Invalid credentials");
    }
    
    setLoading(false);
  };

  const signup = async (email: string, password: string, name: string) => {
    // For demo purposes, we're just mocking signup
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would create a user with your backend
    const user = { id: "user-" + Date.now(), email, name };
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
