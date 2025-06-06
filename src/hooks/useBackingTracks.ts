
import { useState, useEffect } from "react";
import { AudioFile } from "@/types/audio";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBackingTracks() {
  const [loading, setLoading] = useState(true);
  const [backingTracks, setBackingTracks] = useState<AudioFile[]>([]);

  const fetchBackingTracks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('is_backing_track', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString(),
          category: 'backing_track'
        }));
        
        setBackingTracks(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching backing tracks:", error);
      toast.error("Error loading backing tracks: " + (error.message || "An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  // Flag an audio file as a backing track
  const markAsBackingTrack = async (audioId: string, isBackingTrack: boolean = true) => {
    try {
      const { error } = await supabase
        .from('audio_files')
        .update({ is_backing_track: isBackingTrack })
        .eq('id', audioId);
        
      if (error) throw error;
      
      toast.success("Audio file updated successfully");
      fetchBackingTracks();
      
      return true;
    } catch (error: any) {
      console.error("Error updating audio file:", error);
      toast.error("Error updating audio file: " + (error.message || "An unexpected error occurred"));
      return false;
    }
  };

  useEffect(() => {
    fetchBackingTracks();
  }, []);

  return {
    loading,
    backingTracks,
    fetchBackingTracks,
    markAsBackingTrack
  };
}
