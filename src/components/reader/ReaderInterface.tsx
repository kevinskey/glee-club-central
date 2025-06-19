
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Music, BookOpen, Users, Clock, CheckCircle, Upload, ListMusic, Eye, ArrowLeft } from 'lucide-react';
import { PDFLibraryView } from './PDFLibraryView';
import { PDFUploadDialog } from './PDFUploadDialog';
import { MemberReaderView } from './MemberReaderView';
import { SetlistManager } from './SetlistManager';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';
import { PDFFile } from '@/hooks/usePDFLibrary';

export function ReaderInterface() {
  const { isAuthenticated, profile, user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<'library' | 'viewer'>('library');
  const [selectedPDF, setSelectedPDF] = useState<PDFFile | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('library');
  const [showMemberPreview, setShowMemberPreview] = useState(false);

  const handleViewPDF = (pdf: PDFFile) => {
    setSelectedPDF(pdf);
    setCurrentView('viewer');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedPDF(null);
  };

  // If admin is previewing member view, show member interface
  if (isAdmin() && showMemberPreview) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">
              Previewing Member View
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowMemberPreview(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin View
          </Button>
        </div>
        <MemberReaderView />
      </div>
    );
  }

  // If user is authenticated but not admin, show member reader view
  if (isAuthenticated && !isAdmin()) {
    return <MemberReaderView />;
  }

  // Admin view continues below with full library management
  if (currentView === 'viewer' && selectedPDF) {
    return (
      <div className="h-screen">
        <AdvancedPDFViewer 
          url={selectedPDF.file_url} 
          title={selectedPDF.title}
          sheetMusicId={selectedPDF.id}
          onBack={handleBackToLibrary}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Music className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-[#003366] dark:text-white">Music Reader Admin</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Manage the digital sheet music library and member access
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-2 border-orange-100 dark:border-orange-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Admin Dashboard Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-500">
                  Online
                </Badge>
                {isAuthenticated && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Admin Access
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isAuthenticated 
                  ? `Admin panel ready for ${profile?.first_name || 'administrator'}`
                  : 'Sign in for admin access'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <>
                  <Button 
                    onClick={() => setShowMemberPreview(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview Member View
                  </Button>
                  <Button 
                    onClick={() => setUploadDialogOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload PDF
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">PDF Library</TabsTrigger>
              <TabsTrigger value="setlists">Setlist Manager</TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="mt-6">
              <PDFLibraryView 
                onViewPDF={handleViewPDF}
                onUploadPDF={isAuthenticated ? () => setUploadDialogOpen(true) : undefined}
              />
            </TabsContent>
            
            <TabsContent value="setlists" className="mt-6">
              <SetlistManager onViewPDF={handleViewPDF} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <Alert>
          <AlertDescription>
            Sign in with admin credentials to access the Music Reader management dashboard.
          </AlertDescription>
        </Alert>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">Library Management:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
              <li>• Upload new PDFs with metadata and voice part assignments</li>
              <li>• Organize sheet music by categories and tags</li>
              <li>• Monitor member access and usage</li>
              <li>• Manage PDF permissions and availability</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Setlist Management:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
              <li>• Create setlists for performances and rehearsals</li>
              <li>• Add and remove PDFs from setlists</li>
              <li>• Share setlists with members</li>
              <li>• Manage setlist permissions and access</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Member Experience:</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Regular members see a simplified reader interface focused on browsing and reading sheet music and creating their own setlists.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <PDFUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
