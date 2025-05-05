
import { useState } from 'react';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioPageCategory } from '@/types/audio';
import { useAuth } from '@/contexts/AuthContext';
import { getCategoryName } from '@/components/audio/audioCategoryUtils';

export function useRecordingSave({ 
  onSaveComplete 
}: { 
  onSaveComplete: () => void 
}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recordingName, setRecordingName] = useState(`Recording ${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}`);
  const [recordingCategory, setRecordingCategory] = useState<Exclude<AudioPageCategory, "all">>("my_tracks");
  const [isSaving, setIsSaving] = useState(false);

  // Save recording
  const saveRecording = async (audioURL: string | null) => {
    if (!audioURL || !user) {
      toast({
        title: "Save failed",
        description: "No recording to save or user not logged in.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Fetch the actual blob from the URL
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      
      // Create file from blob
      const fileName = `${uuidv4()}.wav`;
      const filePath = `uploads/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('audio')
        .upload(filePath, audioBlob);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);
        
      if (!publicUrlData?.publicUrl) {
        throw new Error('Failed to get public URL');
      }
      
      // Save to database
      const { error: insertError } = await supabase.from('audio_files').insert({
        title: recordingName,
        description: `Recording created on ${format(new Date(), 'PPP')}`,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        uploaded_by: user.id,
        category: recordingCategory
      });
      
      if (insertError) throw insertError;
      
      // Success
      toast({
        title: "Recording saved",
        description: `Your recording has been saved to ${getCategoryName(recordingCategory)}.`,
      });
      
      // Reset state and call completion handler
      setRecordingName(`Recording ${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}`);
      onSaveComplete();
      
      return recordingCategory;
    } catch (error: any) {
      console.error('Error saving recording:', error);
      toast({
        title: "Save failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    recordingName,
    setRecordingName,
    recordingCategory,
    setRecordingCategory,
    isSaving,
    saveRecording
  };
}
