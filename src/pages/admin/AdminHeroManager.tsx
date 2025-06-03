
import React, { useState } from 'react';
import { UniversalHeroManager } from '@/components/admin/UniversalHeroManager';
import { PageHeader } from "@/components/ui/page-header";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { UploadMediaButton } from "@/components/media/UploadMediaButton";
import { Button } from "@/components/ui/button";
import { Wrench, AlertTriangle } from "lucide-react";
import { validateHeroSlideMedia, forceCleanupOrphanedSlides } from "@/utils/heroMediaSync";
import { toast } from "sonner";

export default function AdminHeroManager() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isForceCleanup, setIsForceCleanup] = useState(false);

  const handleUploadComplete = () => {
    console.log("Upload completed in hero manager");
    setUploadModalOpen(false);
    // Refresh the page or trigger a refresh of the hero manager
    window.location.reload();
  };

  const handleValidateMedia = async () => {
    setIsValidating(true);
    try {
      const result = await validateHeroSlideMedia();
      console.log('Validation result:', result);
    } catch (error) {
      console.error("Error validating media:", error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleForceCleanup = async () => {
    if (!confirm('This will forcibly remove ALL broken media references from hero slides. Are you sure?')) {
      return;
    }
    
    setIsForceCleanup(true);
    try {
      const result = await forceCleanupOrphanedSlides();
      console.log('Force cleanup result:', result);
    } catch (error) {
      console.error("Error in force cleanup:", error);
    } finally {
      setIsForceCleanup(false);
    }
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
            <Button
              variant="outline"
              onClick={handleValidateMedia}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              {isValidating ? "Validating..." : "Fix Broken Links"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleForceCleanup}
              disabled={isForceCleanup}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="h-4 w-4" />
              {isForceCleanup ? "Force Cleaning..." : "Force Cleanup"}
            </Button>
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
