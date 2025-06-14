import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from "@/components/ui/page-header";
import { FileImage, Upload, RefreshCw, Grid, List, Image, FileText, Music, Video } from 'lucide-react';
import { UploadMediaModal } from '@/components/UploadMediaModal';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { MediaGridView } from '@/components/media/MediaGridView';
import { MediaListView } from '@/components/media/MediaListView';
import { MediaFilterBar } from '@/components/media/MediaFilterBar';
import { MediaLoadingState } from '@/components/media/MediaLoadingState';
import { toast } from 'sonner';
import { MediaType } from '@/utils/mediaUtils';

const AdminMediaLibraryPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { 
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    isLoading,
    mediaStats,
    mediaTypes,
    categories,
    fetchAllMedia,
    deleteMediaItem
  } = useMediaLibrary();
  
  const handleUploadComplete = () => {
    console.log("Admin: Upload complete");
    setIsUploadModalOpen(false);
    fetchAllMedia();
    toast.success("Media uploaded successfully!");
  };

  const handleRefresh = () => {
    fetchAllMedia();
    toast.success("Media library refreshed");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id);
      toast.success("Media file deleted successfully");
    } catch (error) {
      toast.error("Failed to delete media file");
    }
  };

  const getFileCount = (type: string): number => {
    return (mediaStats.filesByType as Record<string, number>)?.[type] || 0;
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
                {mediaStats.totalFiles} Files
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
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-2"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
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

      {/* Media Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileImage className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Files</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mediaStats.totalFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Image className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Images</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getFileCount('image')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Documents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getFileCount('pdf')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Music className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Audio</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getFileCount('audio')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <MediaFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedMediaType={selectedMediaType as MediaType | "all"}
        setSelectedMediaType={(type: MediaType | "all") => setSelectedMediaType(type)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        dateFilter={dateFilter as "newest" | "oldest"}
        setDateFilter={setDateFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        mediaTypes={mediaTypes}
        categories={categories}
      />

      {/* Media Library Content */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileImage className="h-5 w-5 text-glee-spelman" />
            Media Files
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <MediaLoadingState 
            isLoading={isLoading}
            isEmpty={filteredMediaFiles.length === 0}
            canUpload={true}
            onUploadClick={() => setIsUploadModalOpen(true)}
          />
          
          {!isLoading && filteredMediaFiles.length > 0 && (
            <div>
              {viewMode === "grid" ? (
                <MediaGridView 
                  mediaFiles={filteredMediaFiles}
                  canEdit={true}
                  canDelete={true}
                  onDelete={handleDelete}
                  onRefresh={fetchAllMedia}
                />
              ) : (
                <MediaListView 
                  mediaFiles={filteredMediaFiles}
                  canEdit={true}
                  canDelete={true}
                  onDelete={handleDelete}
                  onRefresh={fetchAllMedia}
                />
              )}
            </div>
          )}
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
