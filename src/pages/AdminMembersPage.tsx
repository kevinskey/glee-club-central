
import React, { useEffect, useState } from "react";
import { MembersPageComponent } from "@/components/members/MembersPageRefactor";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "@/hooks/useUserManagement";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export default function AdminMembersPage() {
  // All hooks at the top
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

  // Use conditional rendering instead of early returns
  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
