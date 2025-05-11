
import React, { useEffect } from "react";
import { MembersPageComponent } from "@/components/members/MembersPageRefactor";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "@/hooks/useUserManagement";
import { toast } from "sonner";

export default function AdminMembersPage() {
  const { isAuthenticated } = useAuth();
  const userManagement = useUserManagement();
  
  // Fetch members on component mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log("AdminMembersPage - Fetching users");
      userManagement.fetchUsers()
        .catch(err => {
          console.error("Error fetching users:", err);
          toast.error("Failed to load member data");
        });
    }
  }, [isAuthenticated, userManagement]);

  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
