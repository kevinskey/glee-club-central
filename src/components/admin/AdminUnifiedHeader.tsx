
import React from 'react';
import { AdminTopBar } from './AdminTopBar';
import { AdminTopNavigation } from './AdminTopNavigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const AdminUnifiedHeader: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="admin-header">
      <AdminTopBar isMobile={isMobile} />
      {!isMobile && <AdminTopNavigation />}
    </div>
  );
};
