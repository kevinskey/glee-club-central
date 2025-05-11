
import React from 'react';
import { RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { RolePermissionProvider } from './contexts/RolePermissionContext';
import { ThemeProvider } from './providers/ThemeProvider';
import { router } from './router';

// Root layout component that will wrap all routes
const RootLayout = () => {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
};

// Update the router to use RootLayout as the root element
router.routes[0].element = <RootLayout />;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RolePermissionProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </RolePermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
