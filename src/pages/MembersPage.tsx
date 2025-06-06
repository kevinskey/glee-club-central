
import React from 'react';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { PageLoader } from '@/components/ui/page-loader';
import { AdminLayout } from '@/layouts/AdminLayout';
import { CleanMembersPage } from '@/components/members/CleanMembersPage';

export default function MembersPage() {
  const { isLoading } = useAuthMigration();

  if (isLoading) {
    return <PageLoader message="Loading members..." />;
  }

  return (
    <AdminLayout>
      <CleanMembersPage />
    </AdminLayout>
  );
}
