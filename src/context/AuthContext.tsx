import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

// Mock users for demo purposes - in a real app, this would be stored in a database
const mockUsers = [
  { email: "user@example.com", password: "password123", name: "Demo User", id: "user-1" },
  { email: "admin@goalsage.com", password: "admin123", name: "Admin User", id: "user-2" }
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Verify the user exists in our mock database
        const userExists = mockUsers.find(u => u.id === parsedUser.id);
        
        if (userExists) {
          setUser(parsedUser);
        } else {
          // If user doesn't exist, clear localStorage
          localStorage.removeItem("user");
        }
      } catch (error) {
        // If JSON is invalid, clear localStorage
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we're just mocking authentication
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists in our mock database
    const foundUser = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    
    if (foundUser) {
      const userData = { 
        id: foundUser.id, 
        email: foundUser.email, 
        name: foundUser.name 
      };
      
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error("Invalid credentials");
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    // For demo purposes, we're just mocking signup
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const existingUser = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUser) {
      setLoading(false);
      throw new Error("Email already in use");
    }
    
    // In a real app, you would create a user with your backend
    const newUserId = `user-${Date.now()}`;
    const userData = { id: newUserId, email, name };
    
    // Add to mock users (this won't persist on reload, just for demo)
    mockUsers.push({ email, password, name, id: newUserId });
    
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out.",
      variant: "default"
    });
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
