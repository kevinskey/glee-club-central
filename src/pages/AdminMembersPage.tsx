
import React, { useEffect } from "react";
import { MembersPageComponent } from "@/components/members/MembersPageRefactor";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "@/hooks/useUserManagement";

export default function AdminMembersPage() {
  const { isAuthenticated } = useAuth();
  const userManagement = useUserManagement();
  
  // Fetch members on component mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log("AdminMembersPage - Fetching users");
      userManagement.fetchUsers();
    }
  }, [isAuthenticated, userManagement.fetchUsers]);

  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
