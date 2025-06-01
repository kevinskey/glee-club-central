
import React from 'react';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { PageLoader } from '@/components/ui/page-loader';
import { MembersPageRefactor } from '@/components/members/MembersPageRefactor';

export default function MembersPage() {
  const { isLoading } = useAuthMigration();

  if (isLoading) {
    return <PageLoader message="Loading members..." />;
  }

  return <MembersPageRefactor />;
}
