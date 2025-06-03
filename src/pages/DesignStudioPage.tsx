
import React from 'react';
import { DesignStudio } from '@/components/design/DesignStudio';
import { UniversalHero } from '@/components/hero/UniversalHero';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

export default function DesignStudioPage() {
  const { user, profile, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <PageLoader message="Loading design studio..." className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!profile?.ecommerce_enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Restricted
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need ecommerce access to use the design studio. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DesignStudio />
    </div>
  );
}
