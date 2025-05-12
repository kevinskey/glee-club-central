
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
      console.log("[DEBUG] AdminMembersPage - Starting to fetch users");
      userManagement.fetchUsers()
        .then((result) => {
          if (mounted) {
            console.log("[DEBUG] AdminMembersPage - Users fetched successfully:", result?.length || 0, "users");
            if (result?.length === 0) {
              console.log("[DEBUG] No users returned from database");
            } else {
              console.log("[DEBUG] First user sample:", result?.[0]);
            }
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (mounted) {
            console.error("[DEBUG] Error fetching users:", err);
            toast.error("Failed to load member data");
            setIsLoading(false);
          }
        });
    }
    
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, userManagement]);

  // Add listeners for user events
  useEffect(() => {
    // Handle user deletion events
    const handleUserDeleted = (event: CustomEvent) => {
      const userId = event.detail?.userId;
      if (userId) {
        console.log(`User ${userId} was deleted, UI will be updated automatically`);
      }
    };
    
    // Handle user added events
    const handleUserAdded = (event: CustomEvent) => {
      const userId = event.detail?.userId;
      if (userId) {
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

  console.log("[DEBUG] AdminMembersPage - Rendering with users data:", 
    userManagement.users?.length, "total users", 
    userManagement.users?.filter(u => u.status !== 'deleted')?.length, "non-deleted users");

  // Once loaded, render the component with the current data
  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
