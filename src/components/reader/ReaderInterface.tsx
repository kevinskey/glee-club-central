import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Music, BookOpen, Users, Clock, CheckCircle, Upload, ListMusic, Eye, ArrowLeft, Search, Settings, Edit, Link, Grid3X3, Share, Store, Cloud, Scan, FileText, Piano, Mic, Gauge, BarChart } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleViewPDF = (pdf: PDFFile) => {
    console.log('📖 ReaderInterface: Opening PDF:', pdf);
    
    if (!pdf.file_url) {
      console.error('❌ ReaderInterface: PDF missing file_url');
      return;
    }
    
    setSelectedPDF(pdf);
    setCurrentView('viewer');
    setSidebarOpen(true);
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedPDF(null);
    setSidebarOpen(false);
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

  // PDF Viewer Mode with forScore-like layout
  if (currentView === 'viewer' && selectedPDF) {
    return (
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackToLibrary}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Library
            </Button>
            <div className="text-sm font-medium text-gray-700">
              {selectedPDF.title}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* PDF Viewer */}
          <div className="flex-1">
            <AdvancedPDFViewer 
              url={selectedPDF.file_url} 
              title={selectedPDF.title}
              sheetMusicId={selectedPDF.id}
              onBack={handleBackToLibrary}
            />
          </div>

          {/* Right Sidebar - forScore style */}
          {sidebarOpen && (
            <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
              <div className="space-y-6">
                {/* Edit This Score Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Edit This Score</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Edit className="h-4 w-4 mr-3" />
                      Annotate
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Link className="h-4 w-4 mr-3" />
                      Links
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Grid3X3 className="h-4 w-4 mr-3" />
                      Buttons
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Grid3X3 className="h-4 w-4 mr-3" />
                      Rearrange
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Scan className="h-4 w-4 mr-3" />
                      Crop
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Share className="h-4 w-4 mr-3" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Add Scores Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-600">Add Scores</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Store className="h-4 w-4 mr-3" />
                      Store
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Cloud className="h-4 w-4 mr-3" />
                      Services
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Scan className="h-4 w-4 mr-3" />
                      Scan
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <FileText className="h-4 w-4 mr-3" />
                      Templates
                    </Button>
                  </div>
                </div>

                {/* More Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-600">More</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Piano className="h-4 w-4 mr-3" />
                      Piano
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Mic className="h-4 w-4 mr-3" />
                      Record
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Gauge className="h-4 w-4 mr-3" />
                      Cue
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <BarChart className="h-4 w-4 mr-3" />
                      Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-blue-600">
                      <Cloud className="h-4 w-4 mr-3" />
                      Sync
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200">
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

      {/* Top Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
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
