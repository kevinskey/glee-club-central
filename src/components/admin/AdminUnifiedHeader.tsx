
import React from 'react';
import { AdminTopBar } from './AdminTopBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const AdminUnifiedHeader: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="admin-unified-header admin-header sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="h-20">
        <AdminTopBar isMobile={isMobile} />
      </div>
    </div>
  );
};
