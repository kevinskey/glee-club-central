
import React from 'react';
import { EnhancedHeroImagesManager } from '@/components/admin/EnhancedHeroImagesManager';
import { PageHeader } from "@/components/ui/page-header";

export default function AdminHeroManager() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Hero Section Manager" 
        description="Manage the images displayed in the hero slideshow on your homepage"
      />
      
      <EnhancedHeroImagesManager />
    </div>
  );
}
