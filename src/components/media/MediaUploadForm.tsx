
import React from "react";
import { Loader2, X, Tag, Plus, Upload, Image } from "lucide-react";
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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      
      setFiles([...files, ...selectedFiles]);
      
      // Auto-detect category based on file type if no files were previously selected
      if (files.length === 0 && selectedFiles.length > 0) {
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

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
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

  const getFileTypeIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.startsWith('audio/')) return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M6 18v4M18 18v4M4 12v8M16 10v10M8 6v14M20 6v14"></path></svg>;
    if (file.type.startsWith('video/')) return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="grid gap-4 py-3 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title" className="font-medium">Title</Label>
            <Input
              id="title"
              placeholder="Media file title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
              required
            />
            {files.length > 1 && (
              <p className="text-xs text-muted-foreground mt-1">
                For multiple files, numbers will be appended to the title (e.g., {title} 1, {title} 2)
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="category" className="font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory} className="mt-1.5">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sheet_music">Sheet Music</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="description" className="font-medium">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Brief description of the file(s)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={isMobile ? 2 : 3}
            className="mt-1.5"
          />
        </div>
        
        <div>
          <Label htmlFor="tags" className="font-medium">Tags</Label>
          <div className="flex gap-2 mt-1.5">
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
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="files" className="font-medium">Files ({files.length})</Label>
            {files.length > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setFiles([])}
                className="text-xs h-8"
              >
                Clear All
              </Button>
            )}
          </div>
          
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Input
                id="files"
                type="file"
                onChange={handleFileChange}
                className="text-sm hidden"
                multiple
                disabled={uploading}
              />
              <div 
                className="w-full h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors rounded-md"
                onClick={() => document.getElementById('files')?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to select files or drop them here
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum 25MB per file
                </p>
              </div>
            </CardContent>
          </Card>
          
          {files.length > 0 && (
            <ScrollArea className="mt-4 h-[200px] rounded-md border">
              <div className="p-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-md bg-card border">
                    <div className="flex items-center gap-2 truncate">
                      <div className="flex-shrink-0 h-8 w-8 rounded bg-muted flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <div className="h-8 w-8 overflow-hidden rounded">
                            <AspectRatio ratio={1/1}>
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt="" 
                                className="h-full w-full object-cover" 
                              />
                            </AspectRatio>
                          </div>
                        ) : (
                          getFileTypeIcon(file)
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-8 w-8 p-0"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        {uploading && uploadProgress > 0 && (
          <div className="w-full bg-muted rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-muted-foreground mt-1">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-end space-x-2'} mt-6 pt-4 border-t`}>
        <Button variant="outline" onClick={onCancel} disabled={uploading} className={isMobile ? 'w-full' : ''}>
          Cancel
        </Button>
        <Button 
          onClick={onUpload} 
          disabled={uploading || files.length === 0 || !title} 
          className={isMobile ? 'w-full' : ''}
        >
          {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {uploading ? `Uploading ${files.length} file(s)...` : `Upload ${files.length || 0} file(s)`}
        </Button>
      </div>
    </div>
  );
}

function UploadProgressBar({ progress }: { progress: number }) {
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
