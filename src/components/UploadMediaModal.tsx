
import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

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
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled 
    ? setControlledOpen 
    : setInternalOpen;

  // Check if user is admin
  const isAdmin = profile?.role === "admin";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (max 25MB)
      if (selectedFile.size > 25 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "File size should be less than 25MB",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    // Check if user is admin
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "Only administrators can upload media files",
        variant: "destructive",
      });
      setOpen(false);
      return;
    }

    if (!file || !title) {
      toast({
        title: "Missing information",
        description: "Please fill in the title and select a file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError, data } = await supabase.storage
        .from('media-library')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: publicURL } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      if (!publicURL) throw new Error("Failed to get public URL");

      // 3. Insert record in database
      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          title,
          description: description || null,
          file_path: filePath,
          file_url: publicURL.publicUrl,
          file_type: file.type,
          uploaded_by: profile?.id
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: `${title} has been uploaded successfully`,
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
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      {!isControlled && (
        <DialogTrigger asChild>
          {isAdmin ? (
            <Button size="sm">
              <FileUp className="mr-2 h-4 w-4" />
              Upload Media
            </Button>
          ) : null}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Media File</DialogTitle>
          <DialogDescription>
            Upload files to the media library for all choir members to access.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Media file title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the file"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
            />
            {file && (
              <p className="text-sm text-muted-foreground mt-1">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
