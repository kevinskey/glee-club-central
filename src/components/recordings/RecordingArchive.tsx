import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Download, Play, Pause, Search, Music, Trash2 } from "lucide-react";

export function RecordingArchive() {
  const { user } = useAuth();
  const { audioFiles, loading, deleteAudioFile } = useAudioFiles();
  const [searchQuery, setSearchQuery] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Filter only user's recordings
  const userRecordings = audioFiles.filter(
    file => file.uploaded_by === user?.id
  );

  // Further filter by search query
  const filteredRecordings = userRecordings.filter(recording => 
    recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (recording.description && recording.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle play/pause
  const handlePlayPause = (recordingId: string, audioUrl: string) => {
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
      audio.addEventListener('ended', () => setPlayingId(null));
      audio.play();
      
      setCurrentAudio(audio);
      setPlayingId(recordingId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      // Check if it's already a formatted date string
      if (dateString.includes('/')) {
        return dateString;
      }
      
      // Otherwise, format it as a relative time
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
      }
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" /> 
          Your Recording Archive
        </CardTitle>
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

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredRecordings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {userRecordings.length === 0 ? 
              "You haven't made any recordings yet." : 
              "No recordings match your search."}
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
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this recording?')) {
                              deleteAudioFile(recording.id);
                            }
                          }}
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
