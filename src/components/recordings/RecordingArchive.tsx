
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Download, Play, Pause, Search, Music, Trash2, AlertTriangle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function RecordingArchive() {
  const { user } = useAuth();
  const { audioFiles, loading, error: audioFilesError, fetchAudioFiles, deleteAudioFile } = useAudioFiles();
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Filter only user's recordings when user is available
  const userRecordings = React.useMemo(() => {
    if (!user || !audioFiles || !Array.isArray(audioFiles)) {
      console.log("No user or audio files available", { user: !!user, audioFiles: Array.isArray(audioFiles) });
      return [];
    }
    
    try {
      const filtered = audioFiles.filter(file => file.uploaded_by === user.id);
      console.log(`Filtered ${filtered.length} recordings for user ${user.id}`);
      return filtered;
    } catch (err) {
      console.error("Error filtering recordings:", err);
      setLoadingError("Error filtering your recordings");
      return [];
    }
  }, [audioFiles, user]);

  // Further filter by search query
  const filteredRecordings = React.useMemo(() => {
    if (!userRecordings.length) return [];
    
    return userRecordings.filter(recording => 
      recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recording.description && recording.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [userRecordings, searchQuery]);

  // Component mount tracking
  useEffect(() => {
    console.log("RecordingArchive mounted");
    setIsComponentMounted(true);
    
    // Fetch audio files on mount with a short delay to ensure auth is ready
    const timer = setTimeout(() => {
      fetchAudioFiles(false);
      setIsInitialLoad(false);
    }, 500);
    
    return () => {
      console.log("RecordingArchive unmounted");
      setIsComponentMounted(false);
      clearTimeout(timer);
      
      // Clean up any playing audio
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  // Handle audio files error from hook
  useEffect(() => {
    if (audioFilesError) {
      setLoadingError(audioFilesError.message || "Error loading recordings");
    }
  }, [audioFilesError]);

  // Handle play/pause with error handling
  const handlePlayPause = (recordingId: string, audioUrl: string) => {
    // Safety check - don't continue if component is unmounting
    if (!isComponentMounted) return;
    
    try {
      if (playingId === recordingId) {
        // Currently playing, so pause
        if (currentAudio) {
          currentAudio.pause();
          setPlayingId(null);
        }
      } else {
        // New audio to play
        if (currentAudio) {
          currentAudio.pause();
        }
        
        const audio = new Audio(audioUrl);
        
        audio.addEventListener('error', (e) => {
          console.error("Audio playback error:", e);
          toast.error("Unable to play recording. Please try again.");
          setPlayingId(null);
        });
        
        audio.addEventListener('ended', () => {
          if (isComponentMounted) {
            setPlayingId(null);
          }
        });
        
        audio.play()
          .then(() => {
            if (isComponentMounted) {
              setCurrentAudio(audio);
              setPlayingId(recordingId);
            }
          })
          .catch(err => {
            console.error("Error playing audio:", err);
            toast.error("Unable to play recording. Please try again.");
          });
      }
    } catch (err) {
      console.error("Audio control error:", err);
      toast.error("An error occurred while trying to play the recording");
    }
  };

  // Format date for display with error handling
  const formatDate = (dateString: string) => {
    try {
      // Check if it's already a formatted date string
      if (dateString.includes('/')) {
        return dateString;
      }
      
      // Otherwise, format it as a relative time
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateString;
    }
  };

  // Handle errors in audio file deletion
  const handleDeleteRecording = async (recordingId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this recording?')) {
        // If this is the currently playing recording, stop it
        if (playingId === recordingId && currentAudio) {
          currentAudio.pause();
          setPlayingId(null);
        }
        
        // Delete the recording
        await deleteAudioFile(recordingId);
      }
    } catch (err) {
      console.error("Error deleting recording:", err);
      toast.error("Failed to delete recording. Please try again.");
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    fetchAudioFiles(true);
    toast.success("Refreshing recordings...");
  };

  // Loading state with better error handling
  if (loading && isInitialLoad) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center">
            <Spinner className="mb-4 h-8 w-8" />
            <p className="text-muted-foreground">Loading your recordings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Error state
  if (loadingError) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <div className="flex flex-col items-center text-center">
            <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to load recordings</h3>
            <p className="text-muted-foreground mb-4">{loadingError}</p>
            <Button variant="outline" onClick={() => {
              setLoadingError(null);
              fetchAudioFiles(true);
            }}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" /> 
            Your Recording Archive
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-1"
          >
            {loading ? <Spinner size="sm" className="mr-1" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {!audioFiles || audioFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't made any recordings yet.
          </div>
        ) : filteredRecordings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recordings match your search.
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecordings.map((recording) => (
                  <TableRow key={recording.id}>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handlePlayPause(recording.id, recording.file_url)}
                      >
                        {playingId === recording.id ? 
                          <Pause className="h-4 w-4" /> : 
                          <Play className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{recording.title}</div>
                      {recording.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {recording.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(recording.created_at)}</TableCell>
                    <TableCell className="hidden md:table-cell capitalize">
                      {recording.category?.replace('_', ' ') || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          asChild
                        >
                          <a href={recording.file_url} download={`${recording.title}.mp3`}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteRecording(recording.id)}
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
        )}
      </CardContent>
    </Card>
  );
}
