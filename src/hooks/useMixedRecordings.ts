
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface MixedRecording {
  id: string;
  title: string;
  description?: string;
  recording_file_url: string;
  recording_file_path: string;
  backing_track_id?: string;
  backing_track?: {
    title: string;
    file_url: string;
  };
  vocal_volume: number;
  backing_volume: number;
  created_at: string;
  user_id: string;
}

export function useMixedRecordings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mixedRecordings, setMixedRecordings] = useState<MixedRecording[]>([]);

  const fetchMixedRecordings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mixed_recordings')
        .select(`
          *,
          backing_track:backing_track_id(title, file_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString(),
        }));
        
        setMixedRecordings(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching mixed recordings:", error);
      toast.error("Error loading recordings: " + (error.message || "An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const saveMixedRecording = async (
    recordingBlob: Blob, 
    title: string, 
    backingTrackId?: string,
    description?: string,
    vocalVolume: number = 1.0,
    backingVolume: number = 0.7
  ) => {
    if (!user) {
      toast.error("You must be logged in to save recordings");
      return null;
    }

    try {
      setLoading(true);
      toast.loading("Saving mixed recording...");
      
      // Create a unique filename
      const fileName = `${user.id}/${Date.now()}_${title.replace(/\s+/g, '_')}.webm`;
      
      // Upload the recording to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, recordingBlob, {
          contentType: 'audio/webm',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: publicURLData } = supabase.storage
        .from('audio')
        .getPublicUrl(fileName);
      
      if (!publicURLData || !publicURLData.publicUrl) {
        throw new Error("Failed to get public URL for recording");
      }
      
      // Save the recording information to the database
      const { data, error } = await supabase
        .from('mixed_recordings')
        .insert({
          user_id: user.id,
          title,
          description,
          backing_track_id: backingTrackId || null,
          recording_file_path: fileName,
          recording_file_url: publicURLData.publicUrl,
          vocal_volume: vocalVolume,
          backing_volume: backingVolume
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success("Mixed recording saved successfully");
      
      await fetchMixedRecordings();
      return data;
    } catch (error: any) {
      toast.dismiss();
      console.error("Error saving mixed recording:", error);
      toast.error("Error saving recording: " + (error.message || "An unexpected error occurred"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteMixedRecording = async (id: string, filePath: string) => {
    try {
      setLoading(true);
      
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from('audio')
        .remove([filePath]);
      
      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
      }
      
      // Delete record from database
      const { error: dbError } = await supabase
        .from('mixed_recordings')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      toast.success("Recording deleted successfully");
      
      // Update state
      setMixedRecordings(prev => prev.filter(recording => recording.id !== id));
      return true;
    } catch (error: any) {
      console.error("Error deleting mixed recording:", error);
      toast.error("Error deleting recording: " + (error.message || "An unexpected error occurred"));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    mixedRecordings,
    fetchMixedRecordings,
    saveMixedRecording,
    deleteMixedRecording
  };
}
