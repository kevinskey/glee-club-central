
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { PhotoUploadTool } from '@/components/historian/PhotoUploadTool';
import { VideoManager } from '@/components/historian/VideoManager';
import { ScrapbookBuilder } from '@/components/historian/ScrapbookBuilder';
import { ArchiveRegistry } from '@/components/historian/ArchiveRegistry';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Camera, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function HistorianDashboard() {
  const { user, profile, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading && profile) {
      const roleTags = profile.role_tags || [];
      const hasAccess = roleTags.includes('Historian') || profile.is_super_admin;
      setIsAuthorized(hasAccess);
      
      if (!hasAccess) {
        toast.error('Access denied: Historian privileges required');
      }
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <MobileOptimizedContainer className="py-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </MobileOptimizedContainer>
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MobileOptimizedContainer className="py-6">
      <PageHeader
        title="Historian Dashboard"
        description="Manage photo archives, videos, scrapbooks, and event documentation"
        icon={<Camera className="h-8 w-8 text-glee-spelman" />}
      />

      {!profile?.role_tags?.includes('Historian') && !profile?.is_super_admin && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You do not have Historian privileges. Please contact an administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Accordion type="multiple" defaultValue={["photos", "videos", "scrapbook", "archive"]}>
          <AccordionItem value="photos">
            <AccordionTrigger className="text-lg font-semibold">
              📸 Photo Upload Tool
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <PhotoUploadTool />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="videos">
            <AccordionTrigger className="text-lg font-semibold">
              🎥 Video Manager
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <VideoManager />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="scrapbook">
            <AccordionTrigger className="text-lg font-semibold">
              📖 Scrapbook Builder
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <ScrapbookBuilder />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="archive">
            <AccordionTrigger className="text-lg font-semibold">
              🗂️ Archive Registry
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <ArchiveRegistry />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MobileOptimizedContainer>
  );
}
