
import React from 'react';
import { UnifiedSlideManager } from '@/components/admin/UnifiedSlideManager';
import { BackButton } from '@/components/ui/back-button';
import { useAuth } from '@/contexts/AuthContext';

export default function UnifiedSlideManagementPage() {
  const { isLoading, isInitialized } = useAuth();

  // Show loading state while auth is initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

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
