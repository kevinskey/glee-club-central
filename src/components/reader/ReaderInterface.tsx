
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Music, BookOpen, Users, Clock, CheckCircle, Upload } from 'lucide-react';
import { PDFLibraryView } from './PDFLibraryView';
import { PDFUploadDialog } from './PDFUploadDialog';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';
import { PDFFile } from '@/hooks/usePDFLibrary';

export function ReaderInterface() {
  const { isAuthenticated, profile } = useAuth();
  const [currentView, setCurrentView] = useState<'library' | 'viewer'>('library');
  const [selectedPDF, setSelectedPDF] = useState<PDFFile | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleViewPDF = (pdf: PDFFile) => {
    setSelectedPDF(pdf);
    setCurrentView('viewer');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setSelectedPDF(null);
  };

  const features = [
    {
      icon: Music,
      title: "Sheet Music Library",
      description: "Access organized sheet music by voice part (S1, S2, A1, A2)"
    },
    {
      icon: BookOpen,
      title: "Digital Scores",
      description: "High-quality PDF viewing with zoom and annotation tools"
    },
    {
      icon: Users,
      title: "Member Access",
      description: "Secure access for Glee Club members only"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Latest repertoire and practice materials"
    }
  ];

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
          <h1 className="text-3xl font-bold text-[#003366] dark:text-white">Music Reader</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Access your digital sheet music library and practice materials
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-2 border-orange-100 dark:border-orange-900">
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
                    Authenticated
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isAuthenticated 
                  ? `Ready for ${profile?.first_name || 'member'} access`
                  : 'Sign in for full access'
                }
              </p>
            </div>
            {isAuthenticated && (
              <Button 
                onClick={() => setUploadDialogOpen(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload PDF
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <feature.icon className="h-6 w-6 text-orange-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#003366] dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF Library */}
      <Card>
        <CardContent className="p-6">
          <PDFLibraryView 
            onViewPDF={handleViewPDF}
            onUploadPDF={isAuthenticated ? () => setUploadDialogOpen(true) : undefined}
          />
        </CardContent>
      </Card>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <Alert>
          <AlertDescription>
            Sign in to your Glee Club account for seamless access to the Music Reader with your personalized sheet music library.
          </AlertDescription>
        </Alert>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">For Members:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
              <li>• Browse the PDF library to find sheet music</li>
              <li>• Click on any PDF to open it in the advanced viewer</li>
              <li>• Use annotation tools to mark up your music</li>
              <li>• Create bookmarks for quick navigation</li>
              <li>• Upload new PDFs to share with the group</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Need Help?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Contact the music librarian or check the help section in the Reader for detailed instructions.
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
