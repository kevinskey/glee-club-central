
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "@/contexts/AuthContext";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <RouterProvider router={router} />
      <PWAInstallPrompt />
    </>
  );
}

export default App;
