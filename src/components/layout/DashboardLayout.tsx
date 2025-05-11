
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export function DashboardLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("DashboardLayout - Auth check:", { isAuthenticated, isLoading });
    
    // Redirect if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      console.log("DashboardLayout - User not authenticated, redirecting to login");
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // Only render the layout if authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
