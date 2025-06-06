
import React from 'react';
import { UnifiedSlideManager } from '@/components/admin/UnifiedSlideManager';
import { BackButton } from '@/components/ui/back-button';

export default function UnifiedSlideManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton 
        label="Back to Admin Dashboard" 
        fallbackPath="/admin" 
        className="mb-6" 
      />
      <UnifiedSlideManager />
    </div>
  );
}
