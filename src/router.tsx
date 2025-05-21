
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
import { AuthProvider } from './contexts/AuthContext';

// Create a properly structured router with all routes
export const router = createBrowserRouter([
  // Wrap the entire application with AuthProvider
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
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
    children: [
      // Public routes with MainLayout
      {
        path: '/',
        element: <MainLayout />,
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
      // Dashboard routes - use route directly, not nested under App
      // This prevents double-wrapping with DashboardLayout
      ...dashboardRoutes.children.map(route => ({
        ...route,
        path: `/dashboard${route.path ? `/${route.path}` : ''}`
      })),
      // Auth routes
      ...authRoutes,
    ],
  },
]);

// Export RouterProvider for index.js to use
export const AppRouter = () => (
  <RouterProvider router={router} />
);

export default router;
