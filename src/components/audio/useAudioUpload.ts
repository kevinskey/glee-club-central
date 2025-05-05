
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AudioUploadFormValues } from "./audioUploadSchema";

export function useAudioUpload({ onUploadComplete, onClose }: {
  onUploadComplete: () => void;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const uploadAudio = async (data: AudioUploadFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload audio files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const file = data.audioFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage
      let { error: uploadError, data: uploadData } = await supabase.storage
        .from("audio")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the file
      const { data: publicUrlData } = supabase.storage
        .from("audio")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }

      // Save metadata to the database
      const { error: insertError } = await supabase.from("audio_files").insert({
        title: data.title,
        description: data.description || null,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        uploaded_by: user.id,
        category: data.category,
      });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Upload Successful",
        description: "Your audio file has been uploaded.",
      });

      // Close modal and refresh audio files list
      onClose();
      onUploadComplete();
    } catch (error: any) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadAudio
  };
}
