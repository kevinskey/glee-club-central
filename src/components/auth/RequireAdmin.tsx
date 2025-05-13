
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAdminProps {
  children: React.ReactNode;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user || !isAdmin) {
    // Redirect to login or unauthorized page
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default RequireAdmin;
