
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { mainRoutes } from './routes/mainRoutes';
import { dashboardRoutes } from './routes/dashboardRoutes';
import { authRoutes } from './routes/authRoutes';
import { adminRoutes } from './routes/adminRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      mainRoutes,
      dashboardRoutes,
      ...authRoutes,
      adminRoutes
    ],
  },
]);

export default router;
