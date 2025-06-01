
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleAuthProvider } from "@/contexts/SimpleAuthContext";
import { RolePermissionProvider } from "@/contexts/RolePermissionContext";
import SimpleRequireAuth from "@/components/auth/SimpleRequireAuth";
import HomePage from "./pages/HomePage";
import SimpleLoginPage from "./pages/auth/SimpleLoginPage";
import RoleDashboardPage from "./pages/RoleDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import MemberDashboardPage from "./pages/dashboard/MemberDashboardPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <SimpleAuthProvider>
            <RolePermissionProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<SimpleLoginPage />} />
                
                {/* Protected routes */}
                <Route path="/role-dashboard" element={
                  <SimpleRequireAuth>
                    <RoleDashboardPage />
                  </SimpleRequireAuth>
                } />
                
                <Route path="/dashboard/admin" element={
                  <SimpleRequireAuth requireAdmin>
                    <AdminDashboardPage />
                  </SimpleRequireAuth>
                } />
                
                <Route path="/dashboard/member" element={
                  <SimpleRequireAuth>
                    <MemberDashboardPage />
                  </SimpleRequireAuth>
                } />
              </Routes>
            </RolePermissionProvider>
          </SimpleAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
