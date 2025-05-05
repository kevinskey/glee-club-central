
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Upload, FileAudio, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { MyRecordingsTable } from "@/components/recordings/MyRecordingsTable";
import { UploadRecordingModal } from "@/components/recordings/UploadRecordingModal";
import { ShareRecordingDialog } from "@/components/recordings/ShareRecordingDialog";
import { supabase } from "@/integrations/supabase/client";
import { AudioFile } from "@/types/audio";

export default function SubmitRecordingPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [myRecordings, setMyRecordings] = useState<AudioFile[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState<AudioFile | null>(null);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const fetchMyRecordings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('uploaded_by', user.id)
        .eq('category', 'my_tracks')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Format dates for display
        const formattedData = data.map((item: any) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString(),
          category: item.category || "my_tracks"
        }));
        
        setMyRecordings(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching recordings:", error);
      toast({
        title: "Error loading recordings",
        description: error.message || "Failed to load your recordings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deleting a recording
  const handleDeleteRecording = async (recordingId: string) => {
    try {
      // First get the file path to delete from storage
      const { data: fileData } = await supabase
        .from('audio_files')
        .select('file_path')
        .eq('id', recordingId)
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
        .eq('id', recordingId);
        
      if (dbError) throw dbError;
      
      // Update UI
      setMyRecordings((prev) => prev.filter(recording => recording.id !== recordingId));
      
      toast({
        title: "Recording deleted",
        description: "Your recording has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting recording:", error);
      toast({
        title: "Error deleting recording",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleShareRecording = (recording: AudioFile) => {
    setSelectedRecording(recording);
    setIsShareDialogOpen(true);
  };

  const handleUploadComplete = () => {
    fetchMyRecordings();
  };

  useEffect(() => {
    if (user) {
      fetchMyRecordings();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Submit Recordings"
        description="Upload and manage your vocal recordings"
        icon={<FileAudio className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" /> Upload Recording
          </Button>
        }
      />
      
      <Tabs defaultValue="my-recordings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-recordings">My Recordings</TabsTrigger>
          <TabsTrigger value="shared">Shared With Me</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-recordings" className="space-y-4">
          <MyRecordingsTable 
            recordings={myRecordings}
            isLoading={isLoading}
            onDelete={handleDeleteRecording}
            onShare={handleShareRecording}
          />
        </TabsContent>
        
        <TabsContent value="shared" className="space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            Shared recordings functionality coming soon.
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <UploadRecordingModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />

      {/* Share Dialog */}
      {selectedRecording && (
        <ShareRecordingDialog
          open={isShareDialogOpen}
          onOpenChange={setIsShareDialogOpen}
          recording={selectedRecording}
        />
      )}
    </div>
  );
}
