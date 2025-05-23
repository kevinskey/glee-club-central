
import { useState, useEffect, useCallback } from "react";
import { AudioFile } from "@/types/audio";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAudioFiles() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [lastFetched, setLastFetched] = useState<number>(0);

  const fetchAudioFiles = useCallback(async (showToast: boolean = false) => {
    // Don't fetch again if we fetched in the last 10 seconds (prevents duplicate fetches)
    const now = Date.now();
    if (now - lastFetched < 10000 && audioFiles.length > 0) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching audio files...");
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error fetching audio files:", error);
        throw new Error(error.message || "Failed to fetch audio files");
      }

      if (data) {
        console.log(`Fetched ${data.length} audio files`);
        // Format dates for display and ensure category exists
        const formattedData = data.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString(),
          // Default category to "recordings" for legacy files
          category: item.category || "recordings"
        }));
        
        setAudioFiles(formattedData);
        setLastFetched(Date.now());
        
        if (showToast) {
          toast({
            title: "Audio files refreshed",
            description: `${formattedData.length} files loaded`,
          });
        }
      }
    } catch (error: any) {
      console.error("Error fetching audio files:", error);
      setError(error);
      
      toast({
        title: "Error loading audio files",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, lastFetched, audioFiles.length]);

  // Delete audio file with better error handling
  const deleteAudioFile = async (deleteId: string) => {
    try {
      setLoading(true);
      
      // First get the file path to delete from storage
      const { data: fileData, error: fetchError } = await supabase
        .from('audio_files')
        .select('file_path')
        .eq('id', deleteId)
        .single();
      
      if (fetchError) {
        throw new Error(`Failed to fetch file data: ${fetchError.message}`);
      }
      
      if (fileData?.file_path) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('audio')
          .remove([fileData.file_path]);
        
        if (storageError) {
          console.warn("Warning: Error deleting file from storage:", storageError);
          // Continue with DB deletion even if storage deletion fails
        }
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', deleteId);
        
      if (dbError) throw new Error(`Database error: ${dbError.message}`);
      
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
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchAudioFiles();
  }, [fetchAudioFiles]);

  return {
    loading,
    error,
    audioFiles,
    fetchAudioFiles,
    deleteAudioFile
  };
}
