
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
  // Show loading state while checking admin status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect non-admin users to the dashboard
  if (!isAdmin()) {
    console.log('User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render children for admin users
  return <>{children}</>;
};
