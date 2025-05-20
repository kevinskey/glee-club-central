
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { mainRoutes } from './routes/mainRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { authRoutes } from './routes/authRoutes';
import { adminRoutes } from './routes/adminRoutes';
import ErrorBoundary from "./components/ErrorBoundary";

// Adding a custom error boundary for router errors
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      mainRoutes,
      dashboardRoutes,
      ...authRoutes,
      adminRoutes
    ],
  },
]);

export default router;
