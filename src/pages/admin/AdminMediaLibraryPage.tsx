
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileImage, Upload, RefreshCw, Grid, List } from 'lucide-react';
import { OptimizedMediaLibrary } from '@/components/media/OptimizedMediaLibrary';
import { UploadMediaModal } from '@/components/UploadMediaModal';
import { usePaginatedMediaLibrary } from '@/hooks/usePaginatedMediaLibrary';
import { toast } from 'sonner';

const AdminMediaLibraryPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    <div className="space-y-8 p-6">
      {/* Page Header with Liquid Glass Design */}
      <div className="glass-card rounded-3xl p-8 animate-glass-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="p-4 glass-royal rounded-2xl">
              <FileImage className="h-10 w-10 text-royal-600" />
            </div>
            <div>
              <h1 className="text-headline font-bold text-gray-900 dark:text-white mb-2">
                Media Library Management
              </h1>
              <p className="text-body text-gray-600 dark:text-gray-300 mb-4">
                Upload, organize, and manage all media files for the Glee Club
              </p>
              <div className="flex items-center gap-3">
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
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* View Mode Toggle with Glass Effect */}
            <div className="flex rounded-2xl glass-card border border-white/20 overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`rounded-none ${viewMode === 'grid' 
                  ? 'glass-button-primary' 
                  : 'glass-button hover:bg-white/20'
                }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={`rounded-none ${viewMode === 'list' 
                  ? 'glass-button-primary' 
                  : 'glass-button hover:bg-white/20'
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="glass-button-secondary flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="glass-button-primary shadow-lg hover:shadow-xl"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        </div>
      </div>

      {/* Media Library with Enhanced Glass Design */}
      <Card className="glass-card border-0 rounded-3xl overflow-hidden animate-glass-scale">
        <CardHeader className="glass-powder border-b border-white/10 p-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <FileImage className="h-6 w-6 text-powder-600" />
            <span className="text-gray-900 dark:text-white">Media Files</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <OptimizedMediaLibrary isAdminView={true} viewMode={viewMode} />
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
