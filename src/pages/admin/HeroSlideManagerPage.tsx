
import React from 'react';
import { HeroSlideManager } from '@/components/admin/HeroSlideManager';
import { BackButton } from '@/components/ui/back-button';

export default function HeroSlideManagerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton 
        label="Back to Admin Dashboard" 
        fallbackPath="/admin" 
        className="mb-6" 
      />
      <HeroSlideManager />
    </div>
  );
}
