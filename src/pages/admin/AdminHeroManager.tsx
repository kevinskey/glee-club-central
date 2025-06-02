
import React from 'react';
import { HeroSlidesManager } from '@/components/admin/HeroSlidesManager';
import { PageHeader } from "@/components/ui/page-header";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export default function AdminHeroManager() {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header for Desktop */}
      <div className="hidden lg:block">
        <AdminTopBar />
      </div>
      
      {/* Main Content */}
      <div className="space-y-6 p-6">
        <PageHeader 
          title="Hero Section Manager" 
          description="Create and manage hero slides with custom text, buttons, and links for your homepage slideshow"
        />
        
        <HeroSlidesManager />
        
        <FloatingThemeToggle position="bottom-right" />
      </div>
    </div>
  );
}
