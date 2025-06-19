
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Play, Pause, Trash2, Download, Music, Info, Volume2 } from "lucide-react";
import { MixedRecording, useMixedRecordings } from "@/hooks/useMixedRecordings";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function MixedRecordingsList() {
  const { loading, mixedRecordings, fetchMixedRecordings, deleteMixedRecording } = useMixedRecordings();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordingDetails, setRecordingDetails] = useState<MixedRecording | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Load recordings on mount
  useEffect(() => {
    fetchMixedRecordings();
  }, []);
  
  // Handle audio playback
  const togglePlayback = (recording: MixedRecording) => {
    if (playingId === recording.id) {
      // Pause current audio
      if (audioElement) {
        audioElement.pause();
        setPlayingId(null);
        setAudioElement(null);
      }
    } else {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
      }
      
      // Play the selected recording
      const audio = new Audio(recording.recording_file_url);
      audio.addEventListener('ended', () => {
        setPlayingId(null);
        setAudioElement(null);
      });
      
      audio.play().then(() => {
        setPlayingId(recording.id);
        setAudioElement(audio);
      }).catch(error => {
        console.error("Error playing audio:", error);
        toast.error("Failed to play audio");
      });
    }
  };
  
  // Handle download
  const handleDownload = (recording: MixedRecording) => {
    const a = document.createElement("a");
    a.href = recording.recording_file_url;
    a.download = `${recording.title}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Confirm deletion
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };
  
  // Handle deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    
    const recording = mixedRecordings.find(r => r.id === deleteId);
    if (!recording) return;
    
    const success = await deleteMixedRecording(deleteId, recording.recording_file_path);
    if (success) {
      setDeleteDialogOpen(false);
      setDeleteId(null);
      
      // If deleting the currently playing recording, stop playback
      if (playingId === deleteId && audioElement) {
        audioElement.pause();
        setPlayingId(null);
        setAudioElement(null);
      }
    }
  };
  
  // Show recording details
  const showDetails = (recording: MixedRecording) => {
    setRecordingDetails(recording);
    setDetailsDialogOpen(true);
  };
  
  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);
  
  if (loading && mixedRecordings.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (mixedRecordings.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <Volume2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No karaoke recordings found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first karaoke recording using the studio above
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Karaoke Recordings</CardTitle>
          <CardDescription>
            Recordings are stored securely in the Supabase "audio" bucket.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[35%]">Title</TableHead>
                  <TableHead className="w-[30%]">Backing Track</TableHead>
                  <TableHead className="w-[15%]">Date</TableHead>
                  <TableHead className="w-[20%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mixedRecordings.map((recording) => (
                  <TableRow key={recording.id}>
                    <TableCell className="font-medium">{recording.title}</TableCell>
                    <TableCell>
                      {recording.backing_track ? (
                        <span className="flex items-center gap-1">
                          <Music className="h-3 w-3 text-primary" />
                          {recording.backing_track.title}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">No backing track</span>
                      )}
                    </TableCell>
                    <TableCell>{recording.created_at}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => showDetails(recording)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant={playingId === recording.id ? "default" : "outline"}
                          size="icon"
                          onClick={() => togglePlayback(recording)}
                        >
                          {playingId === recording.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(recording)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => confirmDelete(recording.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Recording</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this recording? This action cannot be undone.</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Recording Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recording Details</DialogTitle>
          </DialogHeader>
          
          {recordingDetails && (
            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-sm font-medium mb-1">Title</h4>
                <p>{recordingDetails.title}</p>
              </div>
              
              {recordingDetails.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Notes</h4>
                  <p className="text-sm text-muted-foreground">{recordingDetails.description}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-1">Backing Track</h4>
                {recordingDetails.backing_track ? (
                  <p className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    {recordingDetails.backing_track.title}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No backing track used</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Date Recorded</h4>
                  <p className="text-sm">{recordingDetails.created_at}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Volume Settings</h4>
                  <div className="flex gap-4">
                    <span className="text-sm">
                      Vocal: {Math.round(recordingDetails.vocal_volume * 100)}%
                    </span>
                    <span className="text-sm">
                      Backing: {Math.round(recordingDetails.backing_volume * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => handleDownload(recordingDetails)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant={playingId === recordingDetails.id ? "default" : "secondary"}
                  onClick={() => togglePlayback(recordingDetails)}
                  className="flex items-center gap-2"
                >
                  {playingId === recordingDetails.id ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
