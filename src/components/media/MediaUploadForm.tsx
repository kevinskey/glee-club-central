
import React from "react";
import { Loader2, X, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MediaUploadFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  category: string;
  setCategory: (category: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
  uploading: boolean;
  uploadProgress: number;
  onUpload: () => void;
  onCancel: () => void;
}

export function MediaUploadForm({
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  tags,
  setTags,
  files,
  setFiles,
  uploading,
  uploadProgress,
  onUpload,
  onCancel
}: MediaUploadFormProps) {
  const isMobile = useIsMobile();
  const [tagInput, setTagInput] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file size (max 25MB per file)
      const oversizedFiles = selectedFiles.filter(file => file.size > 25 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast("File size error", {
          description: "Each file must be less than 25MB",
        });
        return;
      }
      
      setFiles(selectedFiles);
      
      // Auto-detect category based on file type
      if (selectedFiles.length === 1) {
        const file = selectedFiles[0];
        if (file.type.startsWith('audio/')) {
          setCategory('audio');
        } else if (file.type.startsWith('video/')) {
          setCategory('video');
        } else if (file.type === 'application/pdf') {
          setCategory('sheet_music');
        } else {
          setCategory('other');
        }
      }
    }
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <>
      <div className="grid gap-4 py-3">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Media file title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {files.length > 1 && (
            <p className="text-xs text-muted-foreground">
              For multiple files, numbers will be appended to the title (e.g., {title} 1, {title} 2)
            </p>
          )}
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sheet_music">Sheet Music</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the file(s)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={isMobile ? 2 : 3}
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add tags and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              className="flex-1"
            />
            <Button type="button" size="icon" onClick={addTag}>
              <Plus size={16} />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Tag size={12} />
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeTag(tag)}
                  >
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <FileInput 
          files={files} 
          handleFileChange={handleFileChange} 
        />
        
        {uploading && uploadProgress > 0 && (
          <UploadProgressBar progress={uploadProgress} />
        )}
      </div>
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-end space-x-2'} mt-4`}>
        <Button variant="outline" onClick={onCancel} disabled={uploading} className={isMobile ? 'w-full' : ''}>
          Cancel
        </Button>
        <Button onClick={onUpload} disabled={uploading} className={isMobile ? 'w-full' : ''}>
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploading ? `Uploading ${files.length} file(s)...` : `Upload ${files.length || 0} file(s)`}
        </Button>
      </div>
    </>
  );
}

interface FileInputProps {
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileInput({ files, handleFileChange }: FileInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="files">Files</Label>
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <Input
          id="files"
          type="file"
          onChange={handleFileChange}
          required
          className="text-sm"
          multiple
        />
        <p className="text-xs text-muted-foreground mt-2">
          Drag and drop files here or click to select files. Maximum 25MB per file.
        </p>
      </div>
      {files.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          <p>{files.length} file(s) selected:</p>
          <ul className="mt-1 ml-4 list-disc space-y-1">
            {files.slice(0, 5).map((file, index) => (
              <li key={index} className="break-all">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </li>
            ))}
            {files.length > 5 && <li>...and {files.length - 5} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

interface UploadProgressBarProps {
  progress: number;
}

function UploadProgressBar({ progress }: UploadProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div 
        className="bg-primary h-2.5 rounded-full" 
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs text-muted-foreground mt-1">
        Uploading... {progress}%
      </p>
    </div>
  );
}
