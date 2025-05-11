
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
  
  // Fetch members on component mount
  useEffect(() => {
    if (isAuthenticated) {
      console.log("AdminMembersPage - Fetching users on mount");
      userManagement.fetchUsers()
        .then(() => {
          console.log("AdminMembersPage - Users fetched successfully");
          setIsLoaded(true);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
          toast.error("Failed to load member data");
          setIsLoaded(true);
        });
    }
  }, [isAuthenticated, userManagement]);

  // Add listeners for user events
  useEffect(() => {
    // Handle user deletion events
    const handleUserDeleted = (event: CustomEvent) => {
      console.log("User deleted event detected in AdminMembersPage");
      const userId = event.detail?.userId;
      if (userId) {
        console.log(`User ${userId} was deleted, UI will be updated automatically`);
        // No need to refresh here since useUserManagement.deleteUser now updates the local state
      }
    };
    
    // Handle user added events
    const handleUserAdded = (event: CustomEvent) => {
      console.log("User added event detected in AdminMembersPage");
      const userId = event.detail?.userId;
      if (userId) {
        console.log(`User ${userId} was added, refreshing user list`);
        userManagement.fetchUsers()
          .catch(err => {
            console.error("Error refreshing users after addition:", err);
          });
      }
    };
    
    // Listen for the custom events
    window.addEventListener("user:deleted", handleUserDeleted as EventListener);
    window.addEventListener("user:added", handleUserAdded as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener("user:deleted", handleUserDeleted as EventListener);
      window.removeEventListener("user:added", handleUserAdded as EventListener);
    };
  }, [userManagement]);

  // Use conditional rendering instead of early returns
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
