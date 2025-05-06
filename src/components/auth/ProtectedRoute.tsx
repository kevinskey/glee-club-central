
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"admin" | "member" | "section_leader" | "student_conductor" | "accompanist" | "singer">;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, profile, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Debug the user's role and access
  const userRole = profile?.role || "unknown";
  const userHasAccess = !allowedRoles || (profile && allowedRoles.includes(userRole as any));
  
  console.log({
    accessCheck: {
      userRole,
      allowedRoles,
      hasAccess: userHasAccess,
      isAdmin: isAdmin ? isAdmin() : false,
      profileData: profile
    }
  });

  // Check role-based access if roles are specified
  if (allowedRoles && !userHasAccess) {
    console.log("Access denied - Required roles:", allowedRoles, "User role:", userRole);
    return <Navigate to="/dashboard" replace />;
  }

  // Access granted
  console.log("Route access granted. User role:", userRole, "Admin status:", isAdmin ? isAdmin() : false);

  return <>{children}</>;
};
