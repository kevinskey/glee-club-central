
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { isLoading, isInitialized, isAuthenticated, user } = useAuth();

  console.log('🏗️ App: Render state check:', {
    isInitialized,
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email
  });

  // Show loading only if not initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Starting GleeWorld...</p>
        </div>
      </div>
    );
  }

  // Once initialized, let the router handle everything
  return <RouterProvider router={router} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
