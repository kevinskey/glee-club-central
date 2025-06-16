
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';
import { Header } from '@/components/landing/Header';
import CleanAdminUsers from '@/components/admin/CleanAdminUsers';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function MembersPage() {
  const { user, profile, isLoading, isInitialized, isAuthenticated } = useAuth();

  console.log('👥 MembersPage: State check:', {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading,
    isAuthenticated,
    isInitialized,
    userEmail: user?.email,
    profileRole: profile?.role
  });

  // Show loading during auth initialization
  if (!isInitialized || isLoading) {
    return (
      <PageLoader 
        message="Loading members..."
        className="min-h-screen"
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    console.log('🔒 MembersPage: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ MembersPage: Ready to render members page');

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <CleanAdminUsers />
        </div>
      </div>
    </ErrorBoundary>
  );
}
