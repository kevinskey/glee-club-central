
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function useMediaUpload(
  onUploadComplete?: () => void,
  defaultCategory: string = "general"
) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuth();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(defaultCategory);
    setTags([]);
    setFiles([]);
    setUploading(false);
    setUploadProgress(0);
  };

  const validateUpload = () => {
    console.log("Validating upload - Files:", files.length, "Title:", title);
    if (files.length === 0 || !title) {
      toast("Missing information", {
        description: "Please fill in the title and select at least one file",
      });
      return false;
    }
    
    return true;
  };

  const handleUpload = async () => {
    console.log("handleUpload called - User:", user);
    
    if (!user) {
      console.log("No user found, showing error");
      toast.error("You must be logged in to upload files");
      return;
    }
    
    if (!validateUpload()) {
      console.log("Validation failed");
      return;
    }
    
    console.log("Starting upload process");
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const totalFiles = files.length;
      let completedFiles = 0;
      
      console.log(`Processing ${totalFiles} files`);
      
      // Process each file
      for (const [index, file] of files.entries()) {
        console.log(`Processing file ${index + 1}/${totalFiles}: ${file.name} (${file.size} bytes)`);
        
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        const filePath = `${fileName}.${fileExt}`;
        
        // Adjust title for multiple files
        const fileTitle = totalFiles > 1 
          ? `${title} ${index + 1}` 
          : title;
        
        console.log(`Uploading to storage: ${filePath}`);
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media-library')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error("Storage upload error:", uploadError);
          throw uploadError;
        }
        
        console.log("File uploaded to storage, getting public URL");
        
        // Get public URL
        const { data: publicURLData } = supabase.storage
          .from('media-library')
          .getPublicUrl(filePath);
          
        if (!publicURLData) {
          console.error("Failed to get public URL");
          throw new Error("Failed to get public URL");
        }
        
        console.log("Got public URL, inserting into database");
        
        // Store media metadata in database with file size
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: fileTitle,
            description,
            file_path: filePath,
            file_url: publicURLData.publicUrl,
            file_type: file.type,
            uploaded_by: user.id,
            folder: category,
            tags,
            size: file.size // Explicitly store the file size
          });
          
        if (dbError) {
          console.error("Database insertion error:", dbError);
          throw dbError;
        }
        
        // Update progress
        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
        
        console.log(`Successfully uploaded ${file.name} with size ${file.size} bytes`);
      }
      
      console.log("All files uploaded successfully");
      toast.success(`Successfully uploaded ${files.length} file(s)`);
      
      // Reset form and call completion handler
      resetForm();
      if (onUploadComplete) {
        console.log("Calling onUploadComplete");
        onUploadComplete();
      }
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setUploading(false);
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
