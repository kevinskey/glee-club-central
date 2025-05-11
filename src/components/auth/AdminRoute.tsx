
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading } = useAuth();
  
  // Show loading state while checking admin status
  if (isLoading) {
    return <div className="flex items-center justify-center h-24">Loading...</div>;
  }
  
  // Redirect non-admin users to the dashboard
  if (!isAdmin?.()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render children for admin users
  return <>{children}</>;
};
