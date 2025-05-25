
import React from 'react';
import { MembersPageComponent } from '@/components/members/MembersPageRefactor';
import { useUserManagement } from '@/hooks/useUserManagement';

export default function MembersPage() {
  return <MembersPageComponent useUserManagementHook={useUserManagement} />;
}
