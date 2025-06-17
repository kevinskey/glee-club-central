
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronRight,
  Home 
} from 'lucide-react';
import { MediaFile } from '@/types/media';

interface FolderStructure {
  id: string;
  name: string;
  path: string;
  parentId?: string;
  children?: FolderStructure[];
  fileCount?: number;
}

interface FolderManagerProps {
  currentFolder: string;
  onFolderChange: (folderPath: string) => void;
  onCreateFolder: (folderName: string, parentPath: string) => void;
  canManageFolders?: boolean;
  mediaFiles: MediaFile[];
}

export function FolderManager({ 
  currentFolder, 
  onFolderChange, 
  onCreateFolder,
  canManageFolders = false,
  mediaFiles 
}: FolderManagerProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Extract unique folders from media files
  const folders = React.useMemo(() => {
    const folderSet = new Set<string>();
    mediaFiles.forEach(file => {
      if (file.folder && file.folder !== 'general') {
        folderSet.add(file.folder);
        // Add parent folders
        const parts = file.folder.split('/');
        for (let i = 1; i < parts.length; i++) {
          folderSet.add(parts.slice(0, i + 1).join('/'));
        }
      }
    });
    return Array.from(folderSet).sort();
  }, [mediaFiles]);

  // Build folder structure
  const folderStructure = React.useMemo(() => {
    const structure: FolderStructure[] = [];
    const folderMap = new Map<string, FolderStructure>();

    // Add root folder
    const rootFolder: FolderStructure = {
      id: 'root',
      name: 'All Files',
      path: '',
      fileCount: mediaFiles.filter(f => !f.folder || f.folder === 'general').length
    };
    structure.push(rootFolder);
    folderMap.set('', rootFolder);

    // Process all folders
    folders.forEach(folderPath => {
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      
      const folder: FolderStructure = {
        id: folderPath,
        name: folderName,
        path: folderPath,
        parentId: parentPath || 'root',
        fileCount: mediaFiles.filter(f => f.folder === folderPath).length
      };

      folderMap.set(folderPath, folder);
    });

    return Array.from(folderMap.values()).sort((a, b) => a.path.localeCompare(b.path));
  }, [folders, mediaFiles]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const folderPath = currentFolder ? `${currentFolder}/${newFolderName.trim()}` : newFolderName.trim();
      onCreateFolder(newFolderName.trim(), currentFolder);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const getBreadcrumbs = () => {
    if (!currentFolder) return [];
    return currentFolder.split('/').map((part, index, array) => ({
      name: part,
      path: array.slice(0, index + 1).join('/')
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Folders
          </CardTitle>
          {canManageFolders && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsCreatingFolder(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Breadcrumbs */}
        {currentFolder && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onFolderChange('')}
              className="h-auto p-1"
            >
              <Home className="h-3 w-3" />
            </Button>
            {getBreadcrumbs().map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                <ChevronRight className="h-3 w-3" />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onFolderChange(crumb.path)}
                  className="h-auto p-1 text-xs"
                >
                  {crumb.name}
                </Button>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Create Folder Form */}
        {isCreatingFolder && (
          <div className="flex gap-2">
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setIsCreatingFolder(false);
                  setNewFolderName('');
                }
              }}
              autoFocus
            />
            <Button size="sm" onClick={handleCreateFolder}>
              Create
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setIsCreatingFolder(false);
                setNewFolderName('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Folder List */}
        <div className="space-y-1">
          {folderStructure.map((folder) => (
            <div 
              key={folder.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                currentFolder === folder.path ? 'bg-muted' : ''
              }`}
              onClick={() => onFolderChange(folder.path)}
            >
              <div className="flex items-center gap-2">
                {folder.path === '' ? (
                  <Home className="h-4 w-4" />
                ) : currentFolder === folder.path ? (
                  <FolderOpen className="h-4 w-4" />
                ) : (
                  <Folder className="h-4 w-4" />
                )}
                <span className="text-sm">{folder.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {folder.fileCount}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
