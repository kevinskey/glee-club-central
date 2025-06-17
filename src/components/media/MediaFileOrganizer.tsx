
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Move, 
  Copy, 
  Tag, 
  FolderInput, 
  Archive,
  CheckSquare,
  Square
} from 'lucide-react';
import { MediaFile } from '@/types/media';
import { toast } from 'sonner';

interface MediaFileOrganizerProps {
  selectedFiles: string[];
  onSelectionChange: (fileIds: string[]) => void;
  onMoveFiles: (fileIds: string[], targetFolder: string) => void;
  onUpdateTags: (fileIds: string[], tags: string[]) => void;
  mediaFiles: MediaFile[];
  availableFolders: string[];
  canOrganize?: boolean;
}

export function MediaFileOrganizer({
  selectedFiles,
  onSelectionChange,
  onMoveFiles,
  onUpdateTags,
  mediaFiles,
  availableFolders,
  canOrganize = false
}: MediaFileOrganizerProps) {
  const [targetFolder, setTargetFolder] = useState('');
  const [newTags, setNewTags] = useState('');
  const [isMoving, setIsMoving] = useState(false);

  const selectedFileObjects = mediaFiles.filter(file => selectedFiles.includes(file.id));

  const handleMoveFiles = async () => {
    if (!targetFolder) {
      toast.error('Please select a target folder');
      return;
    }

    setIsMoving(true);
    try {
      await onMoveFiles(selectedFiles, targetFolder);
      toast.success(`Moved ${selectedFiles.length} file(s) to ${targetFolder || 'root folder'}`);
      onSelectionChange([]);
      setTargetFolder('');
    } catch (error) {
      toast.error('Failed to move files');
    } finally {
      setIsMoving(false);
    }
  };

  const handleUpdateTags = async () => {
    if (!newTags.trim()) {
      toast.error('Please enter tags');
      return;
    }

    const tags = newTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    
    try {
      await onUpdateTags(selectedFiles, tags);
      toast.success(`Updated tags for ${selectedFiles.length} file(s)`);
      setNewTags('');
    } catch (error) {
      toast.error('Failed to update tags');
    }
  };

  const handleSelectAll = () => {
    const allFileIds = mediaFiles.map(file => file.id);
    onSelectionChange(allFileIds);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  if (!canOrganize) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          File Organization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {selectedFiles.length} selected
            </Badge>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleSelectAll}
              disabled={selectedFiles.length === mediaFiles.length}
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              Select All
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleDeselectAll}
              disabled={selectedFiles.length === 0}
            >
              <Square className="h-4 w-4 mr-1" />
              Deselect All
            </Button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <>
            {/* Move Files */}
            <div className="space-y-2">
              <Label>Move to Folder</Label>
              <div className="flex gap-2">
                <Select value={targetFolder} onValueChange={setTargetFolder}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select target folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Root Folder</SelectItem>
                    {availableFolders.map(folder => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleMoveFiles}
                  disabled={isMoving}
                >
                  <Move className="h-4 w-4 mr-2" />
                  {isMoving ? 'Moving...' : 'Move'}
                </Button>
              </div>
            </div>

            {/* Update Tags */}
            <div className="space-y-2">
              <Label>Add Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter tags separated by commas"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleUpdateTags}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add Tags
                </Button>
              </div>
            </div>

            {/* Selected Files Preview */}
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedFileObjects.slice(0, 5).map(file => (
                  <div key={file.id} className="text-sm p-2 bg-muted rounded">
                    {file.title}
                  </div>
                ))}
                {selectedFileObjects.length > 5 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {selectedFileObjects.length - 5} more files
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
