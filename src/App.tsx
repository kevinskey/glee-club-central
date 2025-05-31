
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { isLoading, isInitialized } = useAuth();

  // Show loading spinner only briefly while auth is initializing
  if (!isInitialized || (isLoading && !isInitialized)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-glee-spelman mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading GleeWorld...</p>
        </div>
      </div>
    );
  }

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
