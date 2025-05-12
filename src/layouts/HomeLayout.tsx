
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';

const HomeLayout = () => {
  const location = useLocation();
  
  // Log current route for troubleshooting
  React.useEffect(() => {
    console.log("HomeLayout - Current route:", location.pathname);
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default HomeLayout;
