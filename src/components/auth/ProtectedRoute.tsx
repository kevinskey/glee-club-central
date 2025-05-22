
import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  path: string;
  element: React.ReactNode;
  [key: string]: any; // For any additional props
}

const ProtectedRoute = ({ path, element, ...rest }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <Route
      path={path}
      element={isAuthenticated ? element : <Navigate to="/login" />}
      {...rest}
    />
  );
};

export default ProtectedRoute;
