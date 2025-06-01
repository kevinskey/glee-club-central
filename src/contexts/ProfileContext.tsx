
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileContextType {
  profile: any;
  permissions: any[];
  isAdmin: boolean;
  loading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isMember: boolean;
  getUserType: () => 'admin' | 'member';
  refreshProfile: () => Promise<void>;
  createFallbackProfile: (userId: string) => any;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const createFallbackProfile = (userId: string) => ({
    id: userId,
    first_name: 'User',
    last_name: '',
    role: 'member',
    status: 'active',
    is_super_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setPermissions([]);
      setIsAdmin(false);
      setLoading(false);
      setIsInitialized(true);
      return;
    }

    setLoading(true);

    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Profile fetch error:", error);
      const fallbackProfile = createFallbackProfile(user.id);
      setProfile(fallbackProfile);
      setPermissions([]);
      setIsAdmin(false);
    } else {
      setProfile(profileData);
      setPermissions(profileData?.permissions || []);
      setIsAdmin(profileData?.role === "admin" || profileData?.is_super_admin === true);
    }

    setLoading(false);
    setIsInitialized(true);
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const isAuthenticated = !!user;
  const isMember = profile?.role === 'member' || !profile?.role;

  const getUserType = (): 'admin' | 'member' => {
    return isAdmin ? 'admin' : 'member';
  };

  return (
    <ProfileContext.Provider value={{ 
      profile, 
      permissions, 
      isAdmin, 
      loading,
      isAuthenticated,
      isInitialized,
      isMember,
      getUserType,
      refreshProfile,
      createFallbackProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
