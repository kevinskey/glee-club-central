
import React from 'react';
import { HeroSlidesManager } from '@/components/admin/HeroSlidesManager';
import { PageHeader } from "@/components/ui/page-header";

export default function AdminHeroManager() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Hero Section Manager" 
        description="Create and manage hero slides with custom text, buttons, and links for your homepage slideshow"
      />
      
      <HeroSlidesManager />
    </div>
  );
}
