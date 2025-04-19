
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

type UserProfile = {
  id: string;
  name: string;
} | null;

interface AuthContextType {
  user: UserProfile;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Exception when fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);

        if (currentSession?.user) {
          // Use setTimeout to prevent potential deadlocks with Supabase client
          setTimeout(async () => {
            const profile = await fetchUserProfile(currentSession.user.id);
            setUser(profile);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);

      if (currentSession?.user) {
        // Use setTimeout to prevent potential deadlocks with Supabase client
        setTimeout(async () => {
          const profile = await fetchUserProfile(currentSession.user.id);
          setUser(profile);
          setLoading(false);
        }, 0);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        } 
      });
      
      if (error) throw error;
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out.",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
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
