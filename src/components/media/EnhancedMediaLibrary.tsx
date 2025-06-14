
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download, 
  Share2, 
  Copy,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  FileType,
  Folder,
  Link as LinkIcon
} from 'lucide-react';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { formatFileSize } from '@/utils/file-utils';
import { getMediaType, MediaType } from '@/utils/mediaUtils';
import { toast } from 'sonner';
import { MediaListView } from '@/components/media/MediaListView';
import { MediaGridView } from '@/components/media/MediaGridView';

interface EnhancedMediaLibraryProps {
  isAdminView?: boolean;
  viewMode?: 'grid' | 'list';
}

export function EnhancedMediaLibrary({ isAdminView = false, viewMode = 'grid' }: EnhancedMediaLibraryProps) {
  const {
    allMediaFiles,
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
    fetchAllMedia,
    deleteMediaItem
  } = useMediaLibrary();

  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [editingFile, setEditingFile] = useState<any | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Advanced filtering states
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [tagFilter, setTagFilter] = useState<string>('');

  // Get unique values for filters
  const uniqueCategories = [...new Set(allMediaFiles.map(file => file.folder || 'uncategorized'))];
  const uniqueTags = [...new Set(allMediaFiles.flatMap(file => file.tags || []))];
  const uniqueTypes = [...new Set(allMediaFiles.map(file => getMediaType(file.file_type)))];

  // Sort and filter files
  const sortedFiles = React.useMemo(() => {
    let files = [...filteredMediaFiles];

    // Apply additional filters
    if (sizeFilter !== 'all') {
      files = files.filter(file => {
        const size = file.size || 0;
        switch (sizeFilter) {
          case 'small': return size < 1024 * 1024; // < 1MB
          case 'medium': return size >= 1024 * 1024 && size < 10 * 1024 * 1024; // 1-10MB
          case 'large': return size >= 10 * 1024 * 1024; // > 10MB
          default: return true;
        }
      });
    }

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

    if (tagFilter) {
      files = files.filter(file => 
        file.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))
      );
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
  }, [filteredMediaFiles, sizeFilter, dateRangeFilter, tagFilter, sortBy, sortOrder]);

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
        
        <div className="flex gap-2">
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
          
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>File Size</Label>
                <Select value={sizeFilter} onValueChange={(value: any) => setSizeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">Small (&lt; 1MB)</SelectItem>
                    <SelectItem value="medium">Medium (1-10MB)</SelectItem>
                    <SelectItem value="large">Large (&gt; 10MB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Date Range</Label>
                <Select value={dateRangeFilter} onValueChange={(value: any) => setDateRangeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Sort By</Label>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="size">Size</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {sortedFiles.length} file{sortedFiles.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Media Display */}
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
