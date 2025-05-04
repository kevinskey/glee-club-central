
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Define user types
export type UserRole = "admin" | "member";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  voicePart?: "Soprano1" | "Soprano2" | "Alto1" | "Alto2" | "Tenor" | "Bass";
}

// Define auth context types
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demo purposes (replace with Supabase integration later)
const SAMPLE_USERS = [
  {
    id: "admin-1",
    name: "Dr. Kevin Johnson",
    email: "admin@gleeworld.com",
    password: "admin123",
    role: "admin" as UserRole,
  },
  {
    id: "member-1",
    name: "Sarah Parker",
    email: "sarah@example.com",
    password: "member123",
    role: "member" as UserRole,
    voicePart: "Soprano1" as "Soprano1",
  },
  {
    id: "member-2",
    name: "Michael Brown",
    email: "michael@example.com",
    password: "member123",
    role: "member" as UserRole,
    voicePart: "Bass" as "Bass",
  },
];

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("gleeWorldUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("gleeWorldUser");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user in sample data
    const foundUser = SAMPLE_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Create user object without password
      const { password, ...userWithoutPassword } = foundUser;
      const authUser: User = userWithoutPassword;
      
      // Save user to state and localStorage
      setUser(authUser);
      localStorage.setItem("gleeWorldUser", JSON.stringify(authUser));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${authUser.name}!`,
      });
      
      navigate("/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("gleeWorldUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
