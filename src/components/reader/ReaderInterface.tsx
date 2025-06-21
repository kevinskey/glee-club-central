
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    console.log('📖 ReaderInterface: Opening PDF:', pdf);
    console.log('📖 PDF URL:', pdf.file_url);
    console.log('📖 PDF Title:', pdf.title);
    console.log('📖 PDF ID:', pdf.id);
    
    if (!pdf.file_url) {
      console.error('❌ ReaderInterface: PDF missing file_url');
      return;
    }
    
    setSelectedPDF(pdf);
    setCurrentView('viewer');
    console.log('📖 ReaderInterface: View changed to viewer');
  };

  const handleBackToLibrary = () => {
    console.log('📖 ReaderInterface: Returning to library');
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
    console.log('📖 ReaderInterface: Rendering PDF viewer with:', selectedPDF);
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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-3xl font-bold text-[#003366] dark:text-white">Music Reader</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Digital sheet music library and PDF viewer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated && isAdmin() && (
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
        </div>
      </div>

      {/* Top Navigation */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('library')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'library'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => setActiveTab('setlists')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'setlists'
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Setlists
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {/* Status Card */}
          <Card className="border-2 border-orange-100 dark:border-orange-900 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Reader Status
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
                        {isAdmin() ? 'Admin Access' : 'Member Access'}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {isAuthenticated 
                      ? `Ready for ${profile?.first_name || 'user'}`
                      : 'Sign in to access the music library'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          {activeTab === 'library' && (
            <PDFLibraryView 
              onViewPDF={handleViewPDF}
              onUploadPDF={isAuthenticated ? () => setUploadDialogOpen(true) : undefined}
            />
          )}
          
          {activeTab === 'setlists' && (
            <SetlistManager onViewPDF={handleViewPDF} />
          )}

          {/* Authentication Notice */}
          {!isAuthenticated && (
            <Alert className="mt-6">
              <AlertDescription>
                Sign in to access the Music Reader and digital sheet music library.
              </AlertDescription>
            </Alert>
          )}

          {/* Help Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Music Reader Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium">PDF Library:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>• Browse and search through digital sheet music</li>
                  <li>• Filter by voice part, category, and tags</li>
                  <li>• View PDFs with advanced reader features</li>
                  <li>• Create annotations and bookmarks</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Setlist Management:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>• Create personal setlists for performances</li>
                  <li>• Organize sheet music by event or rehearsal</li>
                  <li>• Quick access to frequently used pieces</li>
                  <li>• Share setlists with other members</li>
                </ul>
              </div>
              {isAdmin() && (
                <div className="space-y-2">
                  <h4 className="font-medium">Admin Features:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                    <li>• Upload and manage PDF files</li>
                    <li>• Assign metadata and voice parts</li>
                    <li>• Monitor member access and usage</li>
                    <li>• Preview member experience</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Dialog */}
      <PDFUploadDialog 
        open={uploadDialogOpen} 
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
