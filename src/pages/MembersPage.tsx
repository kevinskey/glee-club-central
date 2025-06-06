
import React from 'react';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { PageLoader } from '@/components/ui/page-loader';
import { CleanMembersPage } from '@/components/members/CleanMembersPage';

export default function MembersPage() {
  const { isLoading } = useAuthMigration();

  if (isLoading) {
    return <PageLoader message="Loading members..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <CleanMembersPage />
      </div>
    </div>
  );
}
