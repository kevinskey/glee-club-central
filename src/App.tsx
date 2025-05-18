
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Spinner } from "@/components/ui/spinner";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWAInstallPrompt } from "@/components/ui/pwa-install-prompt";

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
            <RouterProvider router={router} />
            <PWAInstallPrompt />
          </>
        );
      }}
    </AuthProvider>
  );
}

export default App;
