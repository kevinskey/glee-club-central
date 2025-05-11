
import React, { useEffect, useState } from "react";
import { MembersPageComponent } from "@/components/members/MembersPageRefactor";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "@/hooks/useUserManagement";
import { toast } from "sonner";

export default function AdminMembersPage() {
  const { isAuthenticated } = useAuth();
  const userManagement = useUserManagement();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Fetch members only once on component mount
  useEffect(() => {
    if (isAuthenticated && !isLoaded) {
      console.log("AdminMembersPage - Fetching users");
      userManagement.fetchUsers()
        .then(() => {
          setIsLoaded(true);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          toast.error("Failed to load member data");
          setIsLoaded(true);
        });
    }
  }, [isAuthenticated, userManagement, isLoaded]);

  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
