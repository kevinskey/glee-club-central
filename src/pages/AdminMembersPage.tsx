
import React, { useEffect } from "react";
import { MembersPageComponent } from "@/components/members/MembersPageRefactor";
import { useAuth } from "@/contexts/AuthContext";
import { useUserManagement } from "@/hooks/useUserManagement";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";

/**
 * Admin Members Page - Full featured member management for administrators
 * This is the main page for managing all members with administrative privileges
 */
export default function AdminMembersPage() {
  // All hooks at the top
  const { isAuthenticated } = useAuth();
  const { hasPermission } = usePermissions();
  const userManagement = useUserManagement();
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Fetch members only once on component mount
  useEffect(() => {
    let mounted = true;
    
    if (isAuthenticated) {
      console.log("[DEBUG] AdminMembersPage - Starting to fetch users");
      userManagement.fetchUsers()
        .then((result) => {
          if (mounted) {
            console.log("[DEBUG] AdminMembersPage - Users fetched successfully:", result?.length || 0, "users");
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

  // Once loaded, render the component with the current data
  return <MembersPageComponent useUserManagementHook={() => userManagement} />;
}
