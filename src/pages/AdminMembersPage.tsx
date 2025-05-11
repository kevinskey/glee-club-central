
import React, { useEffect, useState } from "react";
import { MembersPageComponent } from "@/components/members/MembersPageRefactor";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "@/hooks/useUserManagement";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";

export default function AdminMembersPage() {
  // All hooks at the top
  const { isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions();
  const userManagement = useUserManagement();
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch members only once on component mount
  useEffect(() => {
    let mounted = true;
    
    if (isAuthenticated) {
      console.log("AdminMembersPage - Fetching users on mount");
      userManagement.fetchUsers()
        .then((result) => {
          if (mounted) {
            console.log("AdminMembersPage - Users fetched successfully", result?.length || 0, "users");
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (mounted) {
            console.error("Error fetching users:", err);
            toast.error("Failed to load member data");
            setIsLoading(false);
          }
        });
    } else {
      console.log("AdminMembersPage - Not authenticated yet, waiting...");
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, userManagement]);

  // Add listeners for user events
  useEffect(() => {
    // Handle user deletion events
    const handleUserDeleted = (event: CustomEvent) => {
      console.log("User deleted event detected in AdminMembersPage");
      const userId = event.detail?.userId;
      if (userId) {
        console.log(`User ${userId} was deleted, UI will be updated automatically`);
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

  // Verify permissions
  const hasAccess = hasPermission('can_manage_users');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!hasAccess && !isLoading) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading state only during initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  // Once loaded, always render the component with the current data
  console.log("AdminMembersPage - Rendering with user data");
  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
