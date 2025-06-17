
import React, { useState, useMemo } from 'react';
import { useMediaLibrary } from '@/hooks/useMediaLibrary';
import { FolderManager } from './FolderManager';
import { MediaFileOrganizer } from './MediaFileOrganizer';
import { MediaGridView } from './MediaGridView';
import { MediaListView } from './MediaListView';
import { MediaFilterBar } from './MediaFilterBar';
import { getMediaType, MediaType } from '@/utils/mediaUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';

interface OrganizedMediaLibraryProps {
  isAdminView?: boolean;
  onUploadComplete?: () => void;
}

export function OrganizedMediaLibrary({ 
  isAdminView = false, 
  onUploadComplete 
}: OrganizedMediaLibraryProps) {
  const {
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    isLoading,
    deleteMediaItem,
    updateMediaFile,
    fetchAllMedia
  } = useMediaLibrary();

  const [currentFolder, setCurrentFolder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter files by current folder
  const folderFilteredFiles = useMemo(() => {
    if (!currentFolder) {
      return filteredMediaFiles.filter(file => !file.folder || file.folder === 'general');
    }
    return filteredMediaFiles.filter(file => file.folder === currentFolder);
  }, [filteredMediaFiles, currentFolder]);

  // Get available folders from all media files
  const availableFolders = useMemo(() => {
    const folders = new Set<string>();
    filteredMediaFiles.forEach(file => {
      if (file.folder && file.folder !== 'general') {
        folders.add(file.folder);
      }
    });
    return Array.from(folders).sort();
  }, [filteredMediaFiles]);

  const handleCreateFolder = async (folderName: string, parentPath: string) => {
    // This would typically create a folder in your backend
    // For now, we'll just show a toast
    toast.success(`Folder "${folderName}" created`);
  };

  const handleMoveFiles = async (fileIds: string[], targetFolder: string) => {
    try {
      // Update each file's folder
      for (const fileId of fileIds) {
        await supabase
          .from('media_library')
          .update({ folder: targetFolder || 'general' })
          .eq('id', fileId);
      }
      
      // Refresh the media library
      fetchAllMedia();
    } catch (error) {
      console.error('Error moving files:', error);
      throw error;
    }
  };

  const handleUpdateTags = async (fileIds: string[], tags: string[]) => {
    try {
      // Update each file's tags
      for (const fileId of fileIds) {
        const file = filteredMediaFiles.find(f => f.id === fileId);
        if (file) {
          const existingTags = file.tags || [];
          const newTags = [...new Set([...existingTags, ...tags])];
          
          await supabase
            .from('media_library')
            .update({ tags: newTags })
            .eq('id', fileId);
        }
      }
      
      // Refresh the media library
      fetchAllMedia();
    } catch (error) {
      console.error('Error updating tags:', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMediaItem(id);
      // Remove from selection if it was selected
      setSelectedFiles(prev => prev.filter(fileId => fileId !== id));
    } catch (error) {
      // Error already handled in deleteMediaItem
    }
  };

  const handleUpdateTitle = async (id: string, newTitle: string) => {
    try {
      await updateMediaFile(id, { title: newTitle });
    } catch (error) {
      // Error already handled in updateMediaFile
    }
  };

  const handleFileSelect = (fileId: string, selected: boolean) => {
    if (selected) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - Folders and Organization */}
      <div className="lg:col-span-1 space-y-4">
        <FolderManager
          currentFolder={currentFolder}
          onFolderChange={setCurrentFolder}
          onCreateFolder={handleCreateFolder}
          canManageFolders={isAdminView}
          mediaFiles={filteredMediaFiles}
        />
        
        <MediaFileOrganizer
          selectedFiles={selectedFiles}
          onSelectionChange={setSelectedFiles}
          onMoveFiles={handleMoveFiles}
          onUpdateTags={handleUpdateTags}
          mediaFiles={folderFilteredFiles}
          availableFolders={availableFolders}
          canOrganize={isAdminView}
        />
      </div>

      {/* Main Content - Media Files */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <MediaFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedMediaType={selectedMediaType as MediaType | "all"}
            setSelectedMediaType={(type: MediaType | "all") => setSelectedMediaType(type)}
            showAdvancedFilters={false}
            setShowAdvancedFilters={() => {}}
          />
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {folderFilteredFiles.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No files found in this folder. Try uploading some files or check a different folder.
            </p>
          </div>
        ) : viewMode === 'list' ? (
          <MediaListView
            mediaFiles={folderFilteredFiles}
            canEdit={isAdminView}
            canDelete={isAdminView}
            onDelete={handleDelete}
            onUpdateTitle={isAdminView ? handleUpdateTitle : undefined}
            onSelect={isAdminView ? handleFileSelect : undefined}
            selectedFiles={selectedFiles}
          />
        ) : (
          <MediaGridView
            mediaFiles={folderFilteredFiles}
            canEdit={isAdminView}
            canDelete={isAdminView}
            onDelete={handleDelete}
            onUpdateTitle={isAdminView ? handleUpdateTitle : undefined}
            onSelect={isAdminView ? handleFileSelect : undefined}
            selectedFiles={selectedFiles}
          />
        )}
      </div>
    </div>
  );
}
