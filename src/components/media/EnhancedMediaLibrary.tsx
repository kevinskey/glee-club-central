
import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { getMediaType, MediaType } from '@/utils/mediaUtils';
import { MediaGridView } from '@/components/media/MediaGridView';
import { MediaListView } from '@/components/media/MediaListView';
import { MediaFilterBar } from '@/components/media/MediaFilterBar';
import { AdvancedFilters } from '@/components/media/AdvancedFilters';
import { MediaFileStats } from '@/components/media/MediaFileStats';

interface EnhancedMediaLibraryProps {
  isAdminView?: boolean;
  viewMode?: 'grid' | 'list';
}

export function EnhancedMediaLibrary({ isAdminView = false, viewMode = 'grid' }: EnhancedMediaLibraryProps) {
  const {
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    isLoading,
    deleteMediaItem
  } = useMediaLibrary();

  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');

  // Sort and filter files
  const sortedFiles = useMemo(() => {
    let files = [...filteredMediaFiles];

    // Apply size filter
    if (sizeFilter !== 'all') {
      files = files.filter(file => {
        const size = file.size || 0;
        switch (sizeFilter) {
          case 'small': return size < 1024 * 1024;
          case 'medium': return size >= 1024 * 1024 && size < 10 * 1024 * 1024;
          case 'large': return size >= 10 * 1024 * 1024;
          default: return true;
        }
      });
    }

    // Apply date range filter
    if (dateRangeFilter !== 'all') {
      const now = new Date();
      files = files.filter(file => {
        const fileDate = new Date(file.created_at);
        switch (dateRangeFilter) {
          case 'today':
            return fileDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return fileDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            return fileDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            return fileDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    // Sort files
    files.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'size':
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case 'type':
          aValue = getMediaType(a.file_type);
          bValue = getMediaType(b.file_type);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return files;
  }, [filteredMediaFiles, sizeFilter, dateRangeFilter, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading media files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MediaFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedMediaType={selectedMediaType as MediaType | "all"}
        setSelectedMediaType={(type: MediaType | "all") => setSelectedMediaType(type)}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
      />

      {showAdvancedFilters && (
        <AdvancedFilters
          sizeFilter={sizeFilter}
          setSizeFilter={setSizeFilter}
          dateRangeFilter={dateRangeFilter}
          setDateRangeFilter={setDateRangeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      )}

      <MediaFileStats fileCount={sortedFiles.length} />

      {viewMode === 'list' ? (
        <MediaListView
          mediaFiles={sortedFiles}
          canEdit={isAdminView}
          canDelete={isAdminView}
          onDelete={handleDelete}
        />
      ) : (
        <MediaGridView
          mediaFiles={sortedFiles}
          canEdit={isAdminView}
          canDelete={isAdminView}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
