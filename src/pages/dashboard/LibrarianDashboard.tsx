
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
        title="Librarian Dashboard"
        description="Manage sheet music library, folders, and repertoire collection"
        icon={<BookOpen className="h-8 w-8 text-glee-spelman" />}
      />

      {!profile?.role_tags?.includes('Librarian') && !profile?.is_super_admin && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You do not have Librarian privileges. Please contact an administrator.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Accordion type="multiple" defaultValue={["sheet-music", "folders", "repertoire"]}>
          <AccordionItem value="sheet-music">
            <AccordionTrigger className="text-lg font-semibold">
              📚 Sheet Music Tracker
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <SheetMusicTracker />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="folders">
            <AccordionTrigger className="text-lg font-semibold">
              📁 Folder Inventory
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <FolderInventory />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="repertoire">
            <AccordionTrigger className="text-lg font-semibold">
              🎵 Repertoire List
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <RepertoireList />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MobileOptimizedContainer>
  );
}
