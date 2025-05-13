
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useMediaUpload(onComplete: () => void, defaultCategory: string = "general") {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(defaultCategory);
    setTags([]);
    setFiles([]);
    setUploadProgress(0);
  };

  const validateUpload = () => {
    if (files.length === 0 || !title) {
      toast("Missing information", {
        description: "Please fill in the title and select at least one file",
      });
      return false;
    }
    
    // Check file size limit (25MB)
    const oversizedFiles = files.filter(file => file.size > 25 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast("File size limit exceeded", {
        description: "Files must be under 25MB. Please remove any oversized files.",
      });
      return false;
    }
    
    return true;
  };

  const handleUpload = async () => {
    if (!validateUpload()) return;
    
    // Check if user is authenticated and has a valid ID
    if (!user?.id) {
      toast("Authentication required", {
        description: "You must be logged in to upload files",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let successCount = 0;
      
      // Create the media-library bucket if it doesn't exist (this will be handled by Supabase)
      // The bucket should be created via SQL migration
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${category}/${fileName}`;

        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media-library')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('media-library')
          .getPublicUrl(filePath);

        if (!publicURL) throw new Error("Failed to get public URL");

        // Generate a file-specific title if multiple files
        const fileTitle = files.length > 1 
          ? `${title} ${i + 1}` 
          : title;

        // Get file size from the File object
        const fileSize = file.size;

        // Insert record in database with the correct user ID
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: fileTitle,
            description: description || null,
            file_path: filePath,
            file_url: publicURL.publicUrl,
            file_type: file.type,
            uploaded_by: user.id,
            category: category,
            tags: tags,
            folder: category, // Use category as folder for organization
            size: fileSize // Store file size for statistics
          });

        if (dbError) {
          console.error("Database insertion error:", dbError);
          throw dbError;
        }
        
        successCount++;
        
        // Update progress
        setUploadProgress(Math.round((i + 1) / files.length * 100));
      }

      toast("Upload successful", {
        description: `${successCount} file(s) have been uploaded successfully`,
      });
      
      resetForm();
      onComplete();
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast("Upload failed", {
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
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
    handleUpload,
    resetForm
  };
}
