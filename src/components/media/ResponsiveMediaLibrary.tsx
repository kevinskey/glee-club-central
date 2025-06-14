
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Grid, List, Upload, Filter, Loader2 } from 'lucide-react';
import { useInfiniteMediaLibrary } from '@/hooks/useInfiniteMediaLibrary';
import { MediaCard } from '@/components/media/MediaCard';
import { MediaListItem } from '@/components/media/MediaListItem';
import { FixedAspectViewer } from '@/components/media/FixedAspectViewer';
import { ViewportDebugger } from '@/components/media/ViewportDebugger';
import { UploadMediaModal } from '@/components/UploadMediaModal';

interface ResponsiveMediaLibraryProps {
  isAdminView?: boolean;
  showUpload?: boolean;
  onUploadComplete?: () => void;
}

export function ResponsiveMediaLibrary({ 
  isAdminView = false, 
  showUpload = false,
  onUploadComplete 
}: ResponsiveMediaLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const observerRef = useRef<IntersectionObserver>();
  const lastElementRef = useRef<HTMLDivElement>(null);

  const {
    mediaFiles,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refetch
  } = useInfiniteMediaLibrary({
    searchQuery,
    mediaType: selectedMediaType,
    pageSize: 20
  });

  // Infinite scroll implementation
  const lastElementRefCallback = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { threshold: 0.1 });
    
    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, hasMore, loadMore]);

  const handleUploadComplete = () => {
    refetch();
    setIsUploadModalOpen(false);
    onUploadComplete?.();
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFile(fileId);
  };

  const handleCloseViewer = () => {
    setSelectedFile(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load media files</p>
          <Button onClick={refetch}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none">
      {/* Responsive Toolbar */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg sm:text-xl">Media Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Primary Controls - Row 1 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 sm:h-10"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters and Actions - Row 2 */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <div className="flex flex-wrap gap-2 flex-1">
              <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
                <SelectTrigger className="w-full sm:w-32 min-h-[44px] sm:min-h-[40px]">
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

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="min-h-[44px] min-w-[44px] sm:min-h-[40px] sm:min-w-[40px]"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>

            {showUpload && (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="min-h-[44px] sm:min-h-[40px] w-full sm:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''} loaded
              {hasMore && ' (scroll for more)'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Media Content */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading media files...</p>
            </div>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div className="text-center py-12">
            <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No media files found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter settings</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                {mediaFiles.map((file, index) => (
                  <MediaCard
                    key={file.id}
                    file={file}
                    isAdminView={isAdminView}
                    onSelect={handleFileSelect}
                    ref={index === mediaFiles.length - 1 ? lastElementRefCallback : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {mediaFiles.map((file, index) => (
                  <MediaListItem
                    key={file.id}
                    file={file}
                    isAdminView={isAdminView}
                    onSelect={handleFileSelect}
                    ref={index === mediaFiles.length - 1 ? lastElementRefCallback : undefined}
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
          </>
        )}
      </div>

      {/* Fixed Aspect Ratio Viewer */}
      {selectedFile && (
        <FixedAspectViewer
          fileId={selectedFile}
          onClose={handleCloseViewer}
        />
      )}

      {/* Upload Modal */}
      {showUpload && (
        <UploadMediaModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* Viewport Debugger */}
      <ViewportDebugger />
    </div>
  );
}
