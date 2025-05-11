
import React, { useState, useRef, useCallback } from "react";
import { FileUp, Loader2, X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import { truncateText } from "@/lib/utils";

interface UploadSheetMusicModalProps {
  onUploadComplete: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface FileWithMeta {
  file: File;
  id: string;
  title: string;
  composer: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function UploadSheetMusicModal({ 
  onUploadComplete,
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: UploadSheetMusicModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [commonTitle, setCommonTitle] = useState("");
  const [commonComposer, setCommonComposer] = useState("");
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;

  const validateFile = (file: File) => {
    // Validate file type
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a PDF file`,
        variant: "destructive",
      });
      return false;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `${file.name} is larger than 10MB`,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const addFiles = (filesToAdd: File[]) => {
    const newFiles: FileWithMeta[] = [];
    
    Array.from(filesToAdd).forEach(file => {
      if (!validateFile(file)) return;
      
      // Extract title from filename (remove extension)
      const title = file.name.replace(/\.[^/.]+$/, "");
      
      newFiles.push({
        file,
        id: Math.random().toString(36).substring(2),
        title: title,
        composer: commonComposer,
        uploadProgress: 0,
        status: 'pending'
      });
    });
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
    
    // Clear input value to allow selecting the same files again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const updateFileData = (id: string, data: Partial<FileWithMeta>) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === id ? { ...file, ...data } : file
      )
    );
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };
  
  // Apply common metadata to all files
  const applyCommonMetadata = () => {
    if (commonTitle || commonComposer) {
      setFiles(prev => 
        prev.map(file => ({
          ...file,
          title: commonTitle || file.title,
          composer: commonComposer || file.composer,
        }))
      );
      
      toast({
        title: "Metadata applied",
        description: `Applied metadata to ${files.length} files`,
      });
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one PDF file",
        variant: "destructive",
      });
      return;
    }

    // Validate that all files have title and composer
    const invalidFiles = files.filter(file => !file.title || !file.composer);
    if (invalidFiles.length > 0) {
      toast({
        title: "Missing information",
        description: `${invalidFiles.length} files are missing title or composer information`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setOverallProgress(0);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.status === 'success') {
        successCount++;
        continue; // Skip already uploaded files
      }
      
      try {
        // Update file status to uploading
        updateFileData(file.id, { status: 'uploading' });
        
        // Generate a unique file name
        const fileExt = file.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = fileName;

        // Upload file to Supabase Storage (media-library bucket)
        const { error: uploadError, data } = await supabase.storage
          .from('media-library')
          .upload(filePath, file.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('media-library')
          .getPublicUrl(filePath);

        if (!publicURL) throw new Error("Failed to get public URL");

        // Insert record in media_library table
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: file.title,
            description: file.composer,
            file_path: filePath,
            file_url: publicURL.publicUrl,
            file_type: "application/pdf",
            folder: "sheet-music", // Categorize as sheet music
            uploaded_by: profile?.id,
            tags: ["sheet-music", "pdf"]
          });

        if (dbError) throw dbError;

        // Update file status to success
        updateFileData(file.id, { 
          status: 'success',
          uploadProgress: 100
        });
        successCount++;
      } catch (error: any) {
        console.error("Upload error:", error);
        updateFileData(file.id, { 
          status: 'error',
          error: error.message || "An unexpected error occurred",
        });
        errorCount++;
      }
      
      // Update overall progress based on completed count
      setOverallProgress(Math.round(((i + 1) / files.length) * 100));
    }

    toast({
      title: `Upload ${errorCount > 0 ? "completed with errors" : "successful"}`,
      description: `${successCount} of ${files.length} files uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      variant: errorCount > 0 ? "destructive" : "default",
    });
    
    if (successCount > 0) {
      // Only refresh data and close modal if at least one file was uploaded
      onUploadComplete();
    }
    
    setUploading(false);
    
    // If all files were uploaded successfully, close the modal and reset the form
    if (errorCount === 0) {
      setOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setCommonTitle("");
    setCommonComposer("");
    setFiles([]);
    setOverallProgress(0);
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
            Upload Sheet Music
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Sheet Music</DialogTitle>
          <DialogDescription>
            Upload PDF sheet music for the choir library. You can upload multiple files at once.
          </DialogDescription>
        </DialogHeader>
        
        {/* Common metadata section */}
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Common Metadata (optional)</Label>
            <p className="text-xs text-muted-foreground">Apply the same title/composer to all files</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <Label htmlFor="common-title" className="text-xs">Title</Label>
                <Input
                  id="common-title"
                  placeholder="Common title for all files"
                  value={commonTitle}
                  onChange={(e) => setCommonTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="common-composer" className="text-xs">Composer</Label>
                <Input
                  id="common-composer"
                  placeholder="Common composer for all files"
                  value={commonComposer}
                  onChange={(e) => setCommonComposer(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={applyCommonMetadata}
              disabled={!commonTitle && !commonComposer}
              className="mt-1 w-full md:w-auto"
            >
              Apply to All Files
            </Button>
          </div>
          
          {/* File selector */}
          <div className="grid gap-2">
            <Label htmlFor="pdf-files">Select PDF Files</Label>
            <Input
              id="pdf-files"
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="cursor-pointer"
            />
            
            {/* Drag and drop area */}
            <div 
              ref={dropZoneRef}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 ${isDragging ? 'border-primary bg-primary/10' : 'border-dashed'} rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">
                {isDragging ? "Drop files here" : "Click or drag files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF files up to 10MB</p>
            </div>
          </div>
          
          {/* Selected files list */}
          {files.length > 0 && (
            <div className="grid gap-2 mt-2">
              <div className="flex items-center justify-between">
                <Label>Selected Files ({files.length})</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setFiles([])}
                  disabled={uploading}
                >
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {files.map((file) => (
                  <div 
                    key={file.id}
                    className={`p-3 rounded-md border ${
                      file.status === 'success' ? 'bg-green-50 border-green-200' : 
                      file.status === 'error' ? 'bg-red-50 border-red-200' : 
                      'bg-card'
                    } relative`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <FileUp className="h-4 w-4 text-muted-foreground" />
                          <p className="font-medium text-sm truncate" title={file.file.name}>
                            {truncateText(file.file.name, 28)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {(file.file.size / 1024 / 1024).toFixed(1)} MB
                          </Badge>
                        </div>
                        
                        <div className="mt-1.5 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-1">
                          <div>
                            <Label htmlFor={`title-${file.id}`} className="text-xs">Title</Label>
                            <Input
                              id={`title-${file.id}`}
                              value={file.title}
                              onChange={(e) => updateFileData(file.id, { title: e.target.value })}
                              placeholder="Title"
                              className="h-7 text-sm"
                              disabled={file.status === 'success' || uploading}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`composer-${file.id}`} className="text-xs">Composer</Label>
                            <Input
                              id={`composer-${file.id}`}
                              value={file.composer}
                              onChange={(e) => updateFileData(file.id, { composer: e.target.value })}
                              placeholder="Composer"
                              className="h-7 text-sm"
                              disabled={file.status === 'success' || uploading}
                            />
                          </div>
                        </div>
                        
                        {file.status === 'uploading' && (
                          <Progress value={file.uploadProgress} className="h-1.5 mt-2" />
                        )}
                        
                        {file.status === 'error' && (
                          <p className="text-xs text-red-500 mt-1">{file.error}</p>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        disabled={uploading && file.status === 'uploading'}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {uploading && (
            <div className="mt-2">
              <Label className="text-sm">Overall Progress</Label>
              <Progress value={overallProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {Math.round(overallProgress)}% complete
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            {files.some(f => f.status === 'success') ? "Done" : "Cancel"}
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={uploading || files.length === 0}
            className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading 
              ? "Uploading..." 
              : files.some(f => f.status === 'success') 
                ? "Upload Remaining Files" 
                : `Upload ${files.length} Files`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
