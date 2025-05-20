
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { mainRoutes } from './routes/mainRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { authRoutes } from './routes/authRoutes';
import { adminRoutes } from './routes/adminRoutes';
import ErrorBoundary from "./components/ErrorBoundary";

// Creating a router with properly configured error boundaries
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
      mainRoutes,
      dashboardRoutes,
      ...authRoutes,
      adminRoutes
    ],
  },
]);

export default router;
