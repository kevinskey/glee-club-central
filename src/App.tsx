
import React from 'react';
import { RouterProvider, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { RolePermissionProvider } from './contexts/RolePermissionContext';
import { ThemeProvider } from './providers/ThemeProvider';
import router from './router';
import ErrorBoundary from './components/ErrorBoundary';

// App wrapper component that will be used as the router's root element
function AppWrapper() {
  return (
    <ErrorBoundary>
      <Outlet />
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

// Assign the AppWrapper component to be the root element of the router
if (router.routes[0]) {
  router.routes[0].element = <AppWrapper />;
}

// Main App component that provides context providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RolePermissionProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </RolePermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
