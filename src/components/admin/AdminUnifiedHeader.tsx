import React from 'react';
import { AdminTopBar } from './AdminTopBar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export const AdminUnifiedHeader: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="admin-header sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <AdminTopBar isMobile={isMobile} />
    </div>
  );
};
