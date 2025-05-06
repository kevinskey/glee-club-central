
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useMediaUpload(onComplete: () => void) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { profile, user } = useAuth();

  const resetForm = () => {
    setTitle("");
    setDescription("");
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

        // Insert record in database with the correct user ID
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: fileTitle,
            description: description || null,
            file_path: filePath,
            file_url: publicURL.publicUrl,
            file_type: file.type,
            uploaded_by: user.id  // This should be a valid UUID from the auth context
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
    files,
    setFiles,
    uploading,
    uploadProgress,
    handleUpload,
    resetForm
  };
}
