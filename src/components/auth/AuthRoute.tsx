
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/ui/page-loader";

interface AuthRouteProps {
  children: React.ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Loading..." 
        className="min-h-screen"
      />
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default AuthRoute;
