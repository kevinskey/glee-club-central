
import * as React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";
import StaticLandingPage from './pages/StaticLandingPage';
import HomeTemp from './pages/HomeTemp';
import App from './App';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { authRoutes } from './routes/authRoutes';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from './integrations/supabase/client';
import { AuthProvider } from './contexts/AuthContext';

// Create a session provider wrapper to provide Supabase auth helpers
const SessionProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionContextProvider supabaseClient={supabase}>
    {children}
  </SessionContextProvider>
);

// Wrapper component to provide auth context
const AuthProviderWrapper = ({ children }: { children: React.ReactNode }) => (
  <SessionProviderWrapper>
    <AuthProvider>
      {children}
    </AuthProvider>
  </SessionProviderWrapper>
);

// Create a properly structured router with all routes
export const router = createBrowserRouter([
  // Public routes with MainLayout
  {
    path: '/',
    element: (
      <AuthProviderWrapper>
        <MainLayout />
      </AuthProviderWrapper>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'home-temp',
        element: <HomeTemp />,
      },
      {
        path: 'under-construction',
        element: <StaticLandingPage />,
      },
    ],
  },
  // Dashboard routes
  {
    path: '/dashboard',
    element: (
      <AuthProviderWrapper>
        <App />
      </AuthProviderWrapper>
    ),
    errorElement: (
      <ErrorBoundary>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-md w-full p-6 bg-background border rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-glee-purple mb-4">Navigation Error</h1>
            <p className="text-muted-foreground mb-4">
              An error occurred while trying to navigate to the requested page.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-glee-spelman text-white rounded hover:bg-glee-spelman/90"
            >
              Return to Home
            </button>
          </div>
        </div>
      </ErrorBoundary>
    ),
    children: dashboardRoutes.children,
  },
  // Auth routes - also need AuthProvider wrapper
  {
    element: <AuthProviderWrapper><Outlet /></AuthProviderWrapper>,
    children: authRoutes,
  },
]);

export default router;
