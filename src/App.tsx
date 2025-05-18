
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useAuth } from "@/contexts/AuthContext";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";
import { Spinner } from "@/components/ui/spinner";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
      <PWAInstallPrompt />
    </>
  );
}

export default App;
