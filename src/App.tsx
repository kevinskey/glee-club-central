
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import route configurations
import { publicRoutes } from '@/routes/publicRoutes';
import { adminRoutes } from '@/routes/adminRoutes';
import { dashboardRoutes } from '@/routes/dashboardRoutes';
import { roleRoutes } from '@/routes/roleRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <Routes>
              {/* Role Routes */}
              {roleRoutes.map((route, index) => (
                <Route key={`role-${index}`} {...route} />
              ))}
              
              {/* Public Routes */}
              {publicRoutes.map((route, index) => (
                <Route key={`public-${index}`} {...route} />
              ))}
              
              {/* Admin Routes */}
              {adminRoutes.map((route, index) => (
                <Route key={`admin-${index}`} {...route} />
              ))}
              
              {/* Dashboard Routes */}
              {dashboardRoutes.map((route, index) => (
                <Route key={`dashboard-${index}`} {...route} />
              ))}
            </Routes>
          </Router>
          <Toaster />
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
