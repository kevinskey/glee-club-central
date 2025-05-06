
import React, { createContext, useState, useEffect, useContext } from "react";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role: "admin" | "member";
  voice_part?: string; // Adding voice_part which was missing
}

export interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  // Adding missing methods referenced in components
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a user session
    const checkUser = async () => {
      try {
        // In a real app, you'd check for an existing session here
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Simulate fetching profile data
          setProfile({
            id: parsedUser.id,
            first_name: parsedUser.first_name || "Demo",
            last_name: parsedUser.last_name || "User",
            role: parsedUser.role || "member",
            voice_part: parsedUser.voice_part || "Soprano", // Adding default voice part
          });
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // In a real app, you'd authenticate with a backend here
      const mockUser = {
        id: "123",
        email,
        first_name: "Demo",
        last_name: "User",
        role: "member",
        voice_part: "Soprano", // Adding voice part
      };
      
      // Save to local storage to persist the session
      localStorage.setItem("user", JSON.stringify(mockUser));
      
      setUser(mockUser);
      setProfile({
        id: mockUser.id,
        first_name: mockUser.first_name,
        last_name: mockUser.last_name,
        role: mockUser.role as "admin" | "member",
        voice_part: mockUser.voice_part,
      });
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // In a real app, you'd sign out from the backend here
      localStorage.removeItem("user");
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  // Aliases for compatibility with components using different method names
  const login = signIn;
  const logout = signOut;

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signOut,
    // Adding aliases for compatibility
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
