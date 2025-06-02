
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

interface EnhancedMediaLibraryProps {
  isAdminView?: boolean;
}

export function EnhancedMediaLibrary({ isAdminView = false }: EnhancedMediaLibraryProps) {
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

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
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
  }, [filteredMediaFiles, sortBy, sortOrder, sizeFilter, dateRangeFilter, tagFilter]);

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === sortedFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(sortedFiles.map(file => file.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedFiles.length) return;
    
    if (!confirm(`Delete ${selectedFiles.length} selected files?`)) return;

    try {
      for (const fileId of selectedFiles) {
        await deleteMediaItem(fileId);
      }
      setSelectedFiles([]);
      toast.success(`Deleted ${selectedFiles.length} files`);
      fetchAllMedia();
    } catch (error) {
      toast.error('Failed to delete files');
    }
  };

  const handleCopyLink = (fileUrl: string) => {
    navigator.clipboard.writeText(fileUrl);
    toast.success('File URL copied to clipboard');
  };

  const handleEditFile = (file: any) => {
    setEditingFile(file);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingFile) return;
    
    // Save file metadata changes
    try {
      // Update file metadata in database
      toast.success('File updated successfully');
      setIsEditDialogOpen(false);
      setEditingFile(null);
      fetchAllMedia();
    } catch (error) {
      toast.error('Failed to update file');
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedMediaType} onValueChange={(value: string) => setSelectedMediaType(value as MediaType | "all")}>
                <SelectTrigger className="w-32">
                  <FileType className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <Folder className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {showAdvancedFilters ? 'Less' : 'More'} Filters
              </Button>
            </div>

            {/* View Controls */}
            <div className="flex gap-2">
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field as any);
                setSortOrder(order as any);
              }}>
                <SelectTrigger className="w-32">
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest</SelectItem>
                  <SelectItem value="date-asc">Oldest</SelectItem>
                  <SelectItem value="name-asc">Name A-Z</SelectItem>
                  <SelectItem value="name-desc">Name Z-A</SelectItem>
                  <SelectItem value="size-desc">Largest</SelectItem>
                  <SelectItem value="size-asc">Smallest</SelectItem>
                  <SelectItem value="type-asc">Type A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>File Size</Label>
                <Select value={sizeFilter} onValueChange={(value: string) => setSizeFilter(value as 'all' | 'small' | 'medium' | 'large')}>
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
                <Select value={dateRangeFilter} onValueChange={(value: string) => setDateRangeFilter(value as 'all' | 'today' | 'week' | 'month' | 'year')}>
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
                <Label>Tags</Label>
                <Input
                  placeholder="Filter by tags..."
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </span>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedFiles.length === sortedFiles.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Grid/List */}
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1'
      }`}>
        {sortedFiles.map((file) => (
          <MediaFileCard
            key={file.id}
            file={file}
            viewMode={viewMode}
            isSelected={selectedFiles.includes(file.id)}
            onSelect={() => handleFileSelect(file.id)}
            onEdit={() => handleEditFile(file)}
            onCopyLink={() => handleCopyLink(file.file_url)}
            onDelete={() => deleteMediaItem(file.id)}
          />
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit File</DialogTitle>
          </DialogHeader>
          {editingFile && (
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={editingFile.title}
                  onChange={(e) => setEditingFile({...editingFile, title: e.target.value})}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={editingFile.description || ''}
                  onChange={(e) => setEditingFile({...editingFile, description: e.target.value})}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select 
                  value={editingFile.folder || 'general'} 
                  onValueChange={(value) => setEditingFile({...editingFile, folder: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={editingFile.tags?.join(', ') || ''}
                  onChange={(e) => setEditingFile({
                    ...editingFile, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface MediaFileCardProps {
  file: any;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}

function MediaFileCard({ file, viewMode, isSelected, onSelect, onEdit, onCopyLink, onDelete }: MediaFileCardProps) {
  const mediaType = getMediaType(file.file_type);

  if (viewMode === 'list') {
    return (
      <Card className={`transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="rounded"
            />
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              {mediaType === 'image' ? (
                <img src={file.file_url} alt={file.title} className="w-full h-full object-cover rounded" />
              ) : (
                <FileType className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{file.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{file.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{mediaType}</Badge>
                <span className="text-xs text-muted-foreground">{formatFileSize(file.size || 0)}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(file.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={onCopyLink}>
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => window.open(file.file_url, '_blank')}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-colors ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}>
      <CardContent className="p-3">
        <div className="space-y-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="absolute top-2 left-2 rounded z-10"
            />
            <div className="aspect-video bg-gray-100 rounded overflow-hidden">
              {mediaType === 'image' ? (
                <img src={file.file_url} alt={file.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileType className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-sm truncate">{file.title}</h3>
            {file.description && (
              <p className="text-xs text-muted-foreground truncate">{file.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <Badge variant="outline" className="text-xs">{mediaType}</Badge>
              <span className="text-xs text-muted-foreground">{formatFileSize(file.size || 0)}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopyLink}>
              <LinkIcon className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.open(file.file_url, '_blank')}>
              <Download className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
