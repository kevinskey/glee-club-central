import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { usePDFLibrary } from '@/hooks/usePDFLibrary';
import { Upload, X, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface PDFUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [voicePart, setVoicePart] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
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
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setFile(selectedFile);
      
      // Automatically create title from filename
      const autoTitle = createTitleFromFilename(selectedFile.name);
      setTitle(autoTitle);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    try {
      setUploading(true);
      await uploadPDF(file, {
        title: title.trim(),
        description: description.trim() || undefined,
        voice_part: voicePart || undefined,
        category,
        tags
      });
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setVoicePart('');
      setCategory('general');
      setTags([]);
      setTagInput('');
      
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload PDF
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="file">PDF File *</Label>
            <div className="mt-2">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
                </div>
              )}
            </div>
          </div>

          {/* Title - Auto-populated from filename */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title will be auto-generated from filename"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Title is automatically created from filename. You can edit it if needed.
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the PDF content"
              rows={3}
            />
          </div>

          {/* Voice Part and Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="voice-part">Voice Part</Label>
              <Select value={voicePart} onValueChange={setVoicePart}>
                <SelectTrigger>
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

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
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
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

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
              disabled={uploading || !file || !title.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
