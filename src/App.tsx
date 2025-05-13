
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { RolePermissionProvider } from './contexts/RolePermissionContext';
import { ThemeProvider } from './providers/ThemeProvider';
import router from './router';
import ErrorBoundary from './components/ErrorBoundary';

// Main App component that provides context providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RolePermissionProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
          </ErrorBoundary>
        </RolePermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
