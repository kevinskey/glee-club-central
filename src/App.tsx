
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { RolePermissionProvider } from './contexts/RolePermissionContext';
import { ThemeProvider } from './providers/ThemeProvider';
import AppRoutes from './Routes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RolePermissionProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster position="top-right" />
          </BrowserRouter>
        </RolePermissionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
