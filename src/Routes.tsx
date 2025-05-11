
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Spinner } from './components/ui/spinner';

const AppRoutes = () => {
  return (
    <React.Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      }
    >
      <RouterProvider router={router} />
    </React.Suspense>
  );
};

export default AppRoutes;
