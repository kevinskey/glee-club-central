
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

const AdminDashboardPage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to main admin dashboard if user has admin access
  if (isAdmin && isAdmin()) {
    return <Navigate to="/admin" replace />;
  }
  
  // Redirect non-admin users to member dashboard
  return <Navigate to="/dashboard" replace />;
};

export default AdminDashboardPage;
