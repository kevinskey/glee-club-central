
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileContextType {
  profile: any;
  permissions: any[];
  isAdmin: boolean;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setPermissions([]);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        setProfile(null);
        setPermissions([]);
        setIsAdmin(false);
      } else {
        setProfile(profileData);
        setPermissions(profileData?.permissions || []);
        setIsAdmin(profileData?.role === "admin");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, permissions, isAdmin, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used within a ProfileProvider");
  return context;
};
