
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid, List, Loader2 } from 'lucide-react';
import { usePaginatedMediaLibrary, MediaFileDetailed } from '@/hooks/usePaginatedMediaLibrary';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { LightweightMediaCard } from '@/components/media/LightweightMediaCard';
import { MediaListView } from '@/components/media/MediaListView';
import { FilePreviewModal } from '@/components/media/FilePreviewModal';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedMediaLibraryProps {
  isAdminView?: boolean;
  viewMode?: 'grid' | 'list';
}

export function OptimizedMediaLibrary({ isAdminView = false, viewMode = 'grid' }: OptimizedMediaLibraryProps) {
  const {
    mediaFiles,
    isLoading,
    isLoadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    loadMoreMedia,
    getFileDetails,
    deleteMediaItem,
    refetch
  } = usePaginatedMediaLibrary();

  const [previewFile, setPreviewFile] = useState<MediaFileDetailed | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Set up infinite scroll
  useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    loadMore: loadMoreMedia,
    threshold: 300
  });

  const handlePreview = async (fileId: string) => {
    setLoadingPreview(true);
    try {
      const fileDetails = await getFileDetails(fileId);
      if (fileDetails) {
        setPreviewFile(fileDetails);
        setIsPreviewOpen(true);
      } else {
        toast.error('Failed to load file details');
      }
    } catch (error) {
      toast.error('Failed to load file preview');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const updateMediaTitle = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update({ title: newTitle })
        .eq('id', id);

      if (error) throw error;

      // Refresh the media files
      refetch();
      toast.success('Title updated successfully');
    } catch (error) {
      console.error('Error updating media title:', error);
      toast.error('Failed to update title');
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading media files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="pdf">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} loaded
          {hasMore && ' (scroll for more)'}
        </p>
      </div>

      {/* Media Content */}
      {mediaFiles.length === 0 ? (
        <div className="text-center py-12">
          <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No media files found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter settings</p>
        </div>
      ) : viewMode === 'list' ? (
        <MediaListView
          mediaFiles={mediaFiles.map(file => ({
            ...file,
            file_url: file.file_url || '',
            file_path: file.file_url || '', // Use file_url as fallback for file_path
            uploaded_by: '', // Default empty string since this info isn't in MediaFileLight
            is_public: false, // Default to false
            updated_at: file.created_at, // Use created_at as fallback
            description: '', // Default empty description
            folder: 'general', // Default folder
            tags: [] // Default empty tags array
          }))}
          canEdit={isAdminView}
          canDelete={isAdminView}
          onDelete={handleDelete}
          onUpdateTitle={isAdminView ? updateMediaTitle : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaFiles.map((file) => (
            <LightweightMediaCard
              key={file.id}
              file={file}
              canEdit={isAdminView}
              canDelete={isAdminView}
              onDelete={handleDelete}
              onPreview={handlePreview}
              onUpdateTitle={isAdminView ? updateMediaTitle : undefined}
            />
          ))}
        </div>
      )}

      {/* Loading More Indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading more files...</span>
        </div>
      )}

      {/* End of Results */}
      {!hasMore && mediaFiles.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No more files to load</p>
        </div>
      )}

      {/* File Preview Modal */}
      <FilePreviewModal
        file={previewFile}
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
      />

      {/* Loading Preview Overlay */}
      {loadingPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading preview...</span>
          </div>
        </div>
      )}
    </div>
  );
}
