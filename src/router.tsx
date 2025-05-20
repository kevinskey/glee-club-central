
import * as React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";
import StaticLandingPage from './pages/StaticLandingPage';
import HomeTemp from './pages/HomeTemp';
import App from './App';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { authRoutes } from './routes/authRoutes';

// Create a properly structured router with all routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
      {
        index: true,
        element: <Navigate to="/home-temp" replace />,
      },
      {
        path: 'home-temp',
        element: <HomeTemp />,
      },
      {
        path: 'under-construction',
        element: <StaticLandingPage />,
      },
      // Include the dashboard routes as children of the App component
      ...dashboardRoutes.children.map(route => ({
        path: `dashboard${route.path ? `/${route.path}` : ''}`,
        element: route.element,
      })),
      // Include auth routes
      ...authRoutes,
    ],
  },
]);

export default router;
