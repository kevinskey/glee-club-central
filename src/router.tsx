
import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";
import StaticLandingPage from './pages/StaticLandingPage';
import HomeTemp from './pages/HomeTemp';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { authRoutes } from './routes/authRoutes';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import HomeLayout from './layouts/HomeLayout';
import RequireAuth from './components/auth/RequireAuth';
import RoleDashboard from './components/auth/RoleDashboard';
import RecordingsPage from './pages/recordings/RecordingsPage'; // Use consistent import from recordings folder

// Create a properly structured router with all routes
export const router = createBrowserRouter([
  {
    // Root element that wraps the outlet component
    element: <Outlet />,
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
    children: [
      // Public routes with HomeLayout for the home page
      {
        path: '/',
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: (
              <React.Suspense fallback={<div>Loading...</div>}>
                <HomePage />
              </React.Suspense>
            ),
          },
        ],
      },
      // Role-based dashboard redirection for authenticated users
      {
        path: '/role-dashboard',
        element: <RequireAuth><RoleDashboard /></RequireAuth>,
      },
      // Secondary routes with MainLayout
      {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: 'home-temp',
            element: <HomeTemp />,
          },
          {
            path: 'under-construction',
            element: <StaticLandingPage />,
          },
          // Add a top-level recordings route that's protected
          {
            path: 'recordings',
            element: <RequireAuth><RecordingsPage /></RequireAuth>,
          },
        ],
      },
      // Include dashboard routes directly
      dashboardRoutes,
      // Auth routes
      ...authRoutes,
    ],
  },
]);

export default router;
