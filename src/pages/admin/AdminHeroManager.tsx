
import React, { useState } from 'react';
import { UniversalHeroManager } from '@/components/admin/UniversalHeroManager';
import { PageHeader } from "@/components/ui/page-header";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { UploadMediaButton } from "@/components/media/UploadMediaButton";

export default function AdminHeroManager() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleUploadComplete = () => {
    console.log("Upload completed in hero manager");
    setUploadModalOpen(false);
    // Refresh the page or trigger a refresh of the hero manager
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header for Desktop */}
      <div className="hidden lg:block">
        <AdminTopBar />
      </div>
      
      {/* Main Content */}
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-start">
          <PageHeader 
            title="Universal Hero Section Manager" 
            description="Manage all hero sections across your entire application from one central location"
          />
          
          <div className="flex gap-2">
            <UploadMediaButton 
              onClick={() => setUploadModalOpen(true)}
              label="Upload Hero Image"
            />
          </div>
        </div>
        
        <UniversalHeroManager />
        
        <FloatingThemeToggle position="bottom-right" />
      </div>

      {/* Upload Modal */}
      <UploadMediaModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadComplete={handleUploadComplete}
        defaultCategory="hero"
      />
    </div>
  );
}
