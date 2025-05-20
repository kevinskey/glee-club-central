
import { Spinner } from "@/components/ui/spinner";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { Outlet } from "react-router-dom";
import React from "react";

function App() {
  return (
    <AuthProvider>
      {({ isLoading }) => {
        if (isLoading) {
          return (
            <div className="flex justify-center items-center h-screen">
              <Spinner size="lg" />
            </div>
          );
        }

        return (
          <>
            <Outlet />
            <PWAInstallPrompt />
          </>
        );
      }}
    </AuthProvider>
  );
}

export default App;
