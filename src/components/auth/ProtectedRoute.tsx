
import React from 'react';
import { Navigate, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps extends RouteProps {
  path: string;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({
  path,
  element,
  ...rest
}) => {
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
