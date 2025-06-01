
import React from 'react';
import { UserSystemReset } from '@/components/admin/UserSystemReset';
import { useSimpleAuthContextFixed } from '@/contexts/SimpleAuthContextFixed';
import { Navigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';

export default function UserSystemResetPage() {
  const { isAuthenticated, isLoading, isAdmin } = useSimpleAuthContextFixed();

  if (isLoading) {
    return <PageLoader message="Loading..." />;
  }

  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-destructive">System Reset</h1>
        <p className="text-muted-foreground mt-2">
          Administrative tools for resetting the user system to default state.
        </p>
      </div>
      
      <UserSystemReset />
    </div>
  );
}
