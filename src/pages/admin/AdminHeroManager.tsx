
import React from 'react';
import { UniversalHeroManager } from '@/components/admin/UniversalHeroManager';
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
          title="Universal Hero Section Manager" 
          description="Manage all hero sections across your entire application from one central location"
        />
        
        <UniversalHeroManager />
        
        <FloatingThemeToggle position="bottom-right" />
      </div>
    </div>
  );
}
