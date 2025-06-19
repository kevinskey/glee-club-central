
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePDFLibrary } from '@/hooks/usePDFLibrary';
import { Upload, X, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface PDFUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FileWithMetadata {
  file: File;
  id: string;
  title: string;
  description: string;
  voicePart: string;
  category: string;
  tags: string[];
}

// Helper function to create a clean title from filename
const createTitleFromFilename = (filename: string): string => {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // Replace common separators with spaces
  let title = nameWithoutExt
    .replace(/[-_]+/g, ' ')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Capitalize first letter of each word
  title = title.replace(/\b\w/g, char => char.toUpperCase());
  
  return title;
};

export function PDFUploadDialog({ open, onOpenChange }: PDFUploadDialogProps) {
  const { uploadPDF } = usePDFLibrary();
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [uploading, setUploading] = useState(false);

  const voiceParts = [
    { value: 'all', label: 'All Voice Parts' },
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'sacred', label: 'Sacred' },
    { value: 'secular', label: 'Secular' },
    { value: 'classical', label: 'Classical' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'spiritual', label: 'Spiritual' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles: FileWithMetadata[] = Array.from(selectedFiles).map(file => {
        if (file.type !== 'application/pdf') {
          toast.error(`${file.name} is not a PDF file`);
          return null;
        }
        return {
          file,
          id: Math.random().toString(36).substring(2),
          title: createTitleFromFilename(file.name),
          description: '',
          voicePart: 'all', // Default to 'all' instead of empty string
          category: 'general',
          tags: []
        };
      }).filter(Boolean) as FileWithMetadata[];
      
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const updateFileMetadata = (id: string, field: keyof Omit<FileWithMetadata, 'file' | 'id'>, value: any) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, [field]: value } : file
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const addTag = (fileId: string, tag: string) => {
    if (tag.trim()) {
      updateFileMetadata(fileId, 'tags', 
        files.find(f => f.id === fileId)?.tags.includes(tag.trim()) 
          ? files.find(f => f.id === fileId)?.tags 
          : [...(files.find(f => f.id === fileId)?.tags || []), tag.trim()]
      );
    }
  };

  const removeTag = (fileId: string, tagToRemove: string) => {
    updateFileMetadata(fileId, 'tags', 
      files.find(f => f.id === fileId)?.tags.filter(tag => tag !== tagToRemove) || []
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast.error('Please select at least one PDF file');
      return;
    }

    // Validate that all files have titles
    const invalidFiles = files.filter(file => !file.title.trim());
    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} files are missing titles`);
      return;
    }

    try {
      setUploading(true);
      let successCount = 0;
      
      for (const fileData of files) {
        await uploadPDF(fileData.file, {
          title: fileData.title.trim(),
          description: fileData.description.trim() || undefined,
          voice_part: fileData.voicePart === 'all' ? undefined : fileData.voicePart,
          category: fileData.category,
          tags: fileData.tags
        });
        successCount++;
      }
      
      toast.success(`Successfully uploaded ${successCount} PDF${successCount > 1 ? 's' : ''}`);
      
      // Reset form
      setFiles([]);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDFs (Bulk Upload)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="file">Select PDF Files *</Label>
            <div className="mt-2">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Select multiple PDF files. Titles will be auto-generated from filenames.
              </p>
            </div>
          </div>

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Selected Files ({files.length})</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {files.map((fileData) => (
                  <div key={fileData.id} className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm">{fileData.file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {(fileData.file.size / 1024 / 1024).toFixed(1)} MB
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(fileData.id)}
                        disabled={uploading}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Title */}
                      <div>
                        <Label htmlFor={`title-${fileData.id}`} className="text-xs">Title *</Label>
                        <Input
                          id={`title-${fileData.id}`}
                          value={fileData.title}
                          onChange={(e) => updateFileMetadata(fileData.id, 'title', e.target.value)}
                          placeholder="Enter title"
                          disabled={uploading}
                          className="text-sm"
                          required
                        />
                      </div>

                      {/* Voice Part */}
                      <div>
                        <Label className="text-xs">Voice Part</Label>
                        <Select 
                          value={fileData.voicePart} 
                          onValueChange={(value) => updateFileMetadata(fileData.id, 'voicePart', value)}
                          disabled={uploading}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select voice part" />
                          </SelectTrigger>
                          <SelectContent>
                            {voiceParts.map(part => (
                              <SelectItem key={part.value} value={part.value}>
                                {part.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Description */}
                      <div>
                        <Label htmlFor={`description-${fileData.id}`} className="text-xs">Description</Label>
                        <Textarea
                          id={`description-${fileData.id}`}
                          value={fileData.description}
                          onChange={(e) => updateFileMetadata(fileData.id, 'description', e.target.value)}
                          placeholder="Brief description"
                          disabled={uploading}
                          className="text-sm"
                          rows={2}
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <Label className="text-xs">Category</Label>
                        <Select 
                          value={fileData.category} 
                          onValueChange={(value) => updateFileMetadata(fileData.id, 'category', value)}
                          disabled={uploading}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <Label className="text-xs">Tags</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="Add a tag"
                          disabled={uploading}
                          className="text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              addTag(fileData.id, input.value);
                              input.value = '';
                            }
                          }}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            addTag(fileData.id, input.value);
                            input.value = '';
                          }}
                          disabled={uploading}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {fileData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {fileData.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeTag(fileData.id, tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={uploading || files.length === 0}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} PDF${files.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
