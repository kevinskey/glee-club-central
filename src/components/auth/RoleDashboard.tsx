
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { toast } from 'sonner';

export const RoleDashboard: React.FC = () => {
  const { user, profile, isLoading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      console.log('RoleDashboard: Determining user role for routing');
      console.log('User:', user);
      console.log('Profile:', profile);
      console.log('Is Admin:', isAdmin());
      
      // Determine where to route based on role
      if (isAdmin()) {
        console.log('RoleDashboard: Routing admin to admin dashboard');
        navigate('/admin', { replace: true });
      } else {
        console.log('RoleDashboard: Routing member to member dashboard');
        navigate('/dashboard/member', { replace: true });
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log('RoleDashboard: User not authenticated, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, user, profile, isAdmin, navigate]);

  if (isLoading || !isAuthenticated) {
    return (
      <PageLoader 
        message="Determining your access level..." 
        className="min-h-screen"
      />
    );
  }

  // Fallback loader while routing
  return (
    <PageLoader 
      message="Loading your dashboard..." 
      className="min-h-screen"
    />
  );
};

export default RoleDashboard;
