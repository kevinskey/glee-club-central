
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { uploadMediaFile } from "@/utils/supabase/media";

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
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${category}/${fileName}`;

        // Generate a file-specific title if multiple files
        const fileTitle = files.length > 1 
          ? `${title} ${i + 1}` 
          : title;

        // Upload file using our utility
        await uploadMediaFile(file, filePath, {
          title: fileTitle,
          description,
          category,
          tags,
          uploadedBy: user.id
        });
        
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
