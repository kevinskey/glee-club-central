
import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Headphones, Music, Upload, Mic, Square, Play, Save, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UploadAudioModal } from "@/components/UploadAudioModal";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { AudioPageCategory } from "@/types/audio";
import { AudioSearchAndFilter } from "@/components/audio/AudioSearchAndFilter";
import { AudioFilesList } from "@/components/audio/AudioFilesList";
import { DeleteAudioDialog } from "@/components/audio/DeleteAudioDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AudioManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { loading, audioFiles, fetchAudioFiles, deleteAudioFile } = useAudioFiles();
  const [filteredFiles, setFilteredFiles] = useState(audioFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AudioPageCategory>("all");
  const [uploadCategory, setUploadCategory] = useState<Exclude<AudioPageCategory, "all">>("recordings");
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingName, setRecordingName] = useState(`Recording ${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}`);
  
  // References
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Filter audio files based on search and category
  useEffect(() => {
    let results = audioFiles;
    
    // Apply category filter
    if (activeCategory !== "all") {
      results = audioFiles.filter(file => file.category === activeCategory);
    }
    
    // Apply search filter if there's a query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        file => 
          file.title.toLowerCase().includes(lowercaseQuery) || 
          (file.description && file.description.toLowerCase().includes(lowercaseQuery)) ||
          file.created_at.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredFiles(results);
  }, [searchQuery, activeCategory, audioFiles]);

  // Open delete confirmation dialog
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Delete audio file
  const handleDeleteAudioFile = async () => {
    if (!deleteId) return;
    
    const success = await deleteAudioFile(deleteId);
    if (success) {
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Check if user can delete a file (if they uploaded it)
  const canDeleteFile = (uploadedBy: string) => {
    return user?.id === uploadedBy;
  };
  
  // Handle opening the upload modal
  const handleOpenUploadModal = (category?: Exclude<AudioPageCategory, "all">) => {
    if (category) {
      setUploadCategory(category);
    }
    setIsUploadModalOpen(true);
  };

  // Get files for the current category tab
  const getDisplayFilesForCategory = (category: AudioPageCategory) => {
    return category === "all" 
      ? filteredFiles 
      : filteredFiles.filter(file => file.category === category);
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        if (audioRef.current) {
          audioRef.current.src = url;
        }
      };

      // Start the recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start the timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({ 
        title: "Recording failed",
        description: "Could not access microphone. Please ensure you have granted permission.",
        variant: "destructive"
      });
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Play/pause recording
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Save recording
  const saveRecording = async () => {
    if (!audioURL || !user) return;
    
    try {
      // Fetch the actual blob from the URL
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      
      // Create file from blob
      const fileName = `${uuidv4()}.wav`;
      const filePath = `uploads/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
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
        category: 'my_tracks'
      });
      
      if (insertError) throw insertError;
      
      // Success
      toast({
        title: "Recording saved",
        description: "Your recording has been saved to My Tracks.",
      });
      
      // Reset state
      setAudioURL(null);
      setRecordingName(`Recording ${format(new Date(), "yyyy-MM-dd-HH-mm-ss")}`);
      
      // Refresh audio files
      fetchAudioFiles();
      
      // Switch to my_tracks tab
      setActiveCategory('my_tracks');
      
    } catch (error: any) {
      console.error('Error saving recording:', error);
      toast({
        title: "Save failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL, isRecording]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audio Management"
        description="Upload, record, and manage audio files for the choir"
        icon={<Headphones className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => handleOpenUploadModal()}
            className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
          >
            <Upload className="h-4 w-4" /> Upload Audio
          </Button>
        }
      />

      {/* Recording Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" /> Record Audio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {isRecording ? (
                <Button 
                  variant="destructive" 
                  onClick={stopRecording}
                  className="gap-2"
                >
                  <Square className="h-4 w-4" /> Stop Recording
                </Button>
              ) : (
                <Button 
                  onClick={startRecording}
                  className="gap-2"
                  disabled={!!audioURL}
                >
                  <Mic className="h-4 w-4" /> Start Recording
                </Button>
              )}
              
              {isRecording && (
                <div className="flex items-center gap-2 text-red-500 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  <span>Recording: {formatTime(recordingTime)}</span>
                </div>
              )}
            </div>
            
            {audioURL && (
              <div className="space-y-4">
                <Separator />
                <div className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="outline" 
                      onClick={togglePlayback}
                      className="gap-2"
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-4 w-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" /> Play
                        </>
                      )}
                    </Button>
                    <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
                    <div className="flex-1">
                      <input 
                        type="text" 
                        value={recordingName}
                        onChange={(e) => setRecordingName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Recording name"
                      />
                    </div>
                    <Button 
                      onClick={saveRecording}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" /> Save Recording
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter with Tabs Container */}
      <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={(val) => setActiveCategory(val as AudioPageCategory)}>
        <AudioSearchAndFilter 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        {/* Audio Files List/Table for each tab */}
        <TabsContent value="all" className="mt-4">
          <AudioFilesList
            loading={loading}
            displayFiles={getDisplayFilesForCategory("all")}
            category="all"
            searchQuery={searchQuery}
            canDeleteFile={canDeleteFile}
            confirmDelete={confirmDelete}
            onUploadClick={handleOpenUploadModal}
          />
        </TabsContent>
        
        <TabsContent value="part_tracks" className="mt-4">
          <AudioFilesList
            loading={loading}
            displayFiles={getDisplayFilesForCategory("part_tracks")}
            category="part_tracks"
            searchQuery={searchQuery}
            canDeleteFile={canDeleteFile}
            confirmDelete={confirmDelete}
            onUploadClick={handleOpenUploadModal}
          />
        </TabsContent>
        
        <TabsContent value="recordings" className="mt-4">
          <AudioFilesList
            loading={loading}
            displayFiles={getDisplayFilesForCategory("recordings")}
            category="recordings"
            searchQuery={searchQuery}
            canDeleteFile={canDeleteFile}
            confirmDelete={confirmDelete}
            onUploadClick={handleOpenUploadModal}
          />
        </TabsContent>
        
        <TabsContent value="my_tracks" className="mt-4">
          <AudioFilesList
            loading={loading}
            displayFiles={getDisplayFilesForCategory("my_tracks")}
            category="my_tracks"
            searchQuery={searchQuery}
            canDeleteFile={canDeleteFile}
            confirmDelete={confirmDelete}
            onUploadClick={handleOpenUploadModal}
          />
        </TabsContent>
      </Tabs>

      {/* Upload Modal */}
      <UploadAudioModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={fetchAudioFiles}
        defaultCategory={uploadCategory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteAudioDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={handleDeleteAudioFile}
      />
    </div>
  );
}
