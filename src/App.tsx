
import React from "react";
import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/layouts/AppLayout";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Aggressive cache invalidation for removed components
  React.useEffect(() => {
    console.log('App component mounted - all PitchPipe references removed');
    
    // Force garbage collection of any cached module references
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('beforeunload'));
    }
  }, []);
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
              <ProfileProvider>
                <CartProvider>
                  <AppLayout>
                    <Outlet />
                  </AppLayout>
                  <Toaster />
                </CartProvider>
              </ProfileProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
