
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileImage, Upload, RefreshCw } from 'lucide-react';
import { OptimizedMediaLibrary } from '@/components/media/OptimizedMediaLibrary';
import { UploadMediaModal } from '@/components/UploadMediaModal';
import { usePaginatedMediaLibrary } from '@/hooks/usePaginatedMediaLibrary';
import { toast } from 'sonner';

const AdminMediaLibraryPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { refetch } = usePaginatedMediaLibrary();
  
  const handleUploadComplete = () => {
    console.log("Admin: Upload complete");
    setIsUploadModalOpen(false);
    refetch();
    toast.success("Media uploaded successfully!");
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Media library refreshed");
  };
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-glee-spelman/10 rounded-xl">
            <FileImage className="h-8 w-8 text-glee-spelman" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Media Library Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
              Upload, organize, and manage all media files for the Glee Club
            </p>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                <FileImage className="h-3 w-3 mr-1" />
                Optimized Loading
              </Badge>
              <Badge variant="outline" className="text-sm">
                Admin Access
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-glee-spelman hover:bg-glee-spelman/90 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Media Library */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileImage className="h-5 w-5 text-glee-spelman" />
            Media Files
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <OptimizedMediaLibrary isAdminView={true} />
        </CardContent>
      </Card>
        
      <UploadMediaModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default AdminMediaLibraryPage;
