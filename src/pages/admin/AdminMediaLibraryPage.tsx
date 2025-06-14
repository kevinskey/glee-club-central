
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileImage, Upload, RefreshCw } from 'lucide-react';
import { ResponsiveMediaLibrary } from '@/components/media/ResponsiveMediaLibrary';
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
    <div className="space-y-8 p-4 sm:p-6">
      {/* Page Header with Liquid Glass Design */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 animate-glass-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 glass-royal rounded-2xl flex-shrink-0">
              <FileImage className="h-8 w-8 sm:h-10 sm:w-10 text-royal-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-headline font-bold text-gray-900 dark:text-white mb-2">
                Media Library Management
              </h1>
              <p className="text-sm sm:text-body text-gray-600 dark:text-gray-300 mb-4">
                Upload, organize, and manage all media files for the Glee Club
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="outline" className="glass-button border-royal-300/30 text-royal-700 dark:text-royal-300">
                  <FileImage className="h-3 w-3 mr-1" />
                  Optimized Loading
                </Badge>
                <Badge variant="outline" className="glass-button border-powder-300/30 text-powder-700 dark:text-powder-300">
                  Admin Access
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="glass-button-secondary flex items-center gap-2 min-h-[44px] sm:min-h-[40px]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="glass-button-primary shadow-lg hover:shadow-xl min-h-[44px] sm:min-h-[40px]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        </div>
      </div>

      {/* Responsive Media Library */}
      <ResponsiveMediaLibrary
        isAdminView={true}
        showUpload={false}
        onUploadComplete={handleUploadComplete}
      />
        
      <UploadMediaModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
};

export default AdminMediaLibraryPage;
