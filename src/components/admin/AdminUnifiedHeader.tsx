
import React from 'react';
import { AdminTopBar } from './AdminTopBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const AdminUnifiedHeader: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="admin-header">
      <AdminTopBar isMobile={isMobile} />
    </div>
  );
};
