
import React, { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/sonner";

interface UploadMediaModalProps {
  onUploadComplete: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UploadMediaModal({ 
  onUploadComplete,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: UploadMediaModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { profile } = useAuth();
  const isMobile = useIsMobile();
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled 
    ? setControlledOpen 
    : setInternalOpen;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Validate file size (max 25MB per file)
      const oversizedFiles = selectedFiles.filter(file => file.size > 25 * 1024 * 1024);
      
      if (oversizedFiles.length > 0) {
        toast({
          title: "File(s) too large",
          description: "Each file must be less than 25MB",
          variant: "destructive",
        });
        return;
      }
      
      setFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (files.length === 0 || !title) {
      toast({
        title: "Missing information",
        description: "Please fill in the title and select at least one file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let successCount = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = fileName;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('media-library')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('media-library')
          .getPublicUrl(filePath);

        if (!publicURL) throw new Error("Failed to get public URL");

        // Generate a file-specific title if multiple files
        const fileTitle = files.length > 1 
          ? `${title} ${i + 1}` 
          : title;

        // Insert record in database
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: fileTitle,
            description: description || null,
            file_path: filePath,
            file_url: publicURL.publicUrl,
            file_type: file.type,
            uploaded_by: profile?.id
          });

        if (dbError) throw dbError;
        
        successCount++;
        
        // Update progress
        setUploadProgress(Math.round((i + 1) / files.length * 100));
      }

      toast({
        title: "Upload successful",
        description: `${successCount} file(s) have been uploaded successfully`,
      });
      
      // Close modal and refresh data
      setOpen(false);
      resetForm();
      onUploadComplete();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
    setUploadProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button size="sm">
            <FileUp className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={`${isMobile ? 'w-[calc(100%-2rem)]' : 'sm:max-w-[500px]'} overflow-y-auto max-h-[90vh]`}>
        <DialogHeader>
          <DialogTitle>Upload Media Files</DialogTitle>
          <DialogDescription>
            Upload multiple files to the media library. Maximum file size is 25MB per file.
          </DialogDescription>
        </DialogHeader>
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
            <Label htmlFor="files">Files</Label>
            <Input
              id="files"
              type="file"
              onChange={handleFileChange}
              required
              className="text-sm"
              multiple
            />
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
          {uploading && uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-primary h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="text-xs text-muted-foreground mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
        <DialogFooter className={isMobile ? 'flex-col space-y-2' : ''}>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading} className={isMobile ? 'w-full' : ''}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading} className={isMobile ? 'w-full' : ''}>
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uploading ? `Uploading ${files.length} file(s)...` : `Upload ${files.length || 0} file(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
