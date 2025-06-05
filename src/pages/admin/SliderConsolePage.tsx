
import React from 'react';
import { SliderAdminConsole } from '@/components/admin/SliderAdminConsole';
import { BackButton } from '@/components/ui/back-button';

export default function SliderConsolePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton 
        label="Back to Admin Dashboard" 
        fallbackPath="/admin" 
        className="mb-6" 
      />
      <SliderAdminConsole />
    </div>
  );
}
