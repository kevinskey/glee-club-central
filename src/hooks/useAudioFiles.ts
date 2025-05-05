
import { useState, useEffect } from "react";
import { AudioFile } from "@/types/audio";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAudioFiles() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  const fetchAudioFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display and ensure category exists
        const formattedData = data.map((item) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString(),
          // Default category to "recordings" for legacy files
          category: item.category || "recordings"
        }));
        
        setAudioFiles(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching audio files:", error);
      toast({
        title: "Error loading audio files",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete audio file
  const deleteAudioFile = async (deleteId: string) => {
    try {
      // First get the file path to delete from storage
      const { data: fileData } = await supabase
        .from('audio_files')
        .select('file_path')
        .eq('id', deleteId)
        .single();
      
      if (fileData?.file_path) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('audio')
          .remove([fileData.file_path]);
        
        if (storageError) {
          console.error("Error deleting file from storage:", storageError);
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', deleteId);
        
      if (dbError) throw dbError;
      
      // Update UI
      setAudioFiles(audioFiles.filter(file => file.id !== deleteId));
      
      toast({
        title: "Audio file deleted",
        description: "The audio file has been successfully deleted.",
      });

      return true;
    } catch (error: any) {
      console.error("Error deleting audio file:", error);
      toast({
        title: "Error deleting audio file",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  return {
    loading,
    audioFiles,
    fetchAudioFiles,
    deleteAudioFile
  };
}
