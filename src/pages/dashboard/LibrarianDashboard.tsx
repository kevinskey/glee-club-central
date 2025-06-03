
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { PageHeader } from '@/components/ui/page-header';
import { MobileOptimizedContainer } from '@/components/mobile/MobileOptimizedContainer';
import { SheetMusicTracker } from '@/components/librarian/SheetMusicTracker';
import { FolderInventory } from '@/components/librarian/FolderInventory';
import { RepertoireList } from '@/components/librarian/RepertoireList';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function LibrarianDashboard() {
  const { user, profile, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading && profile) {
      const roleTags = profile.role_tags || [];
      const hasAccess = roleTags.includes('Librarian') || profile.is_super_admin;
      setIsAuthorized(hasAccess);
      
      if (!hasAccess) {
        toast.error('Access denied: Librarian privileges required');
      }
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <MobileOptimizedContainer className="pt-4 pb-12">
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
    <MobileOptimizedContainer className="pt-4 pb-12 px-3 sm:px-6">
      <PageHeader
        title="Librarian Dashboard"
        description="Manage sheet music library, folders, and repertoire collection"
        icon={<BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-glee-spelman" />}
      />

      {!profile?.role_tags?.includes('Librarian') && !profile?.is_super_admin && (
        <Alert variant="destructive" className="mb-4 sm:mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You do not have Librarian privileges. Please contact an administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 sm:space-y-6">
        <Accordion type="multiple" defaultValue={["sheet-music", "folders", "repertoire"]} className="w-full">
          <AccordionItem value="sheet-music" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              📚 Sheet Music Tracker
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <SheetMusicTracker />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="folders" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              📁 Folder Inventory
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <FolderInventory />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="repertoire" className="border rounded-lg px-4 sm:px-6">
            <AccordionTrigger className="text-sm sm:text-lg font-semibold py-3 sm:py-4">
              🎵 Repertoire List
            </AccordionTrigger>
            <AccordionContent className="pt-2 sm:pt-4 pb-4 sm:pb-6">
              <RepertoireList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MobileOptimizedContainer>
  );
}
