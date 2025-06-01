
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, isAdmin } = useSimpleAuthContext();
  
  if (!user || !isAdmin()) {
    // Redirect to login or unauthorized page
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default RequireAdmin;
