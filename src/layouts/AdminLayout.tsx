
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

export default function AdminLayout() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background w-full">
      <div className="flex-1 flex flex-col md:flex-row">
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
