
import React from 'react';
import { CleanMembersPage } from '@/components/members/CleanMembersPage';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { PageLoader } from '@/components/ui/page-loader';

export default function MembersPage() {
  const { isLoading, isAuthenticated, isAdmin } = useAuthMigration();

  console.log('🔧 Admin MembersPage: Loading state:', { isLoading, isAuthenticated, isAdmin: isAdmin() });

  if (isLoading) {
    return <PageLoader message="Loading members..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return <CleanMembersPage />;
}
