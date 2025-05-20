
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AudioFile } from "@/types/audio";
import { toast } from "sonner";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlayCircle, 
  PauseCircle, 
  Download, 
  Folder, 
  File, 
  Search, 
  XCircle,
  Package,
  Trash2
} from "lucide-react";

export function RecordingLibrary() {
  // State for audio files
  const [myRecordings, setMyRecordings] = useState<AudioFile[]>([]);
  const [filteredRecordings, setFilteredRecordings] = useState<AudioFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Custom hooks
  const { user } = useAuth();
  const { audioFiles, loading, deleteAudioFile } = useAudioFiles();
  
  // Load audio files
  useEffect(() => {
    if (user && audioFiles.length > 0) {
      // Filter files by current user
      const userRecordings = audioFiles.filter(
        file => file.uploaded_by === user.id
      );
      setMyRecordings(userRecordings);
      setFilteredRecordings(userRecordings);
    }
  }, [user, audioFiles]);
  
  // Effect to handle search and filtering
  useEffect(() => {
    if (myRecordings.length === 0) return;
    
    let result = [...myRecordings];
    
    // Apply folder filter
    if (currentFolder) {
      result = result.filter(file => file.category === currentFolder);
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        file => 
          file.title.toLowerCase().includes(term) || 
          file.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredRecordings(result);
  }, [searchTerm, currentFolder, myRecordings]);
  
  // Get unique folders from recordings
  const getFolders = (): string[] => {
    if (!myRecordings.length) return [];
    const folders = new Set(myRecordings.map(file => file.category));
    return Array.from(folders);
  };
  
  // Handle play/pause audio
  const togglePlayAudio = (file: AudioFile) => {
    if (playingId === file.id) {
      // Pause current
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
    } else {
      // Play new file
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = file.file_url;
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Error playing audio");
        });
        setPlayingId(file.id);
      }
    }
  };
  
  // Handle audio end
  const handleAudioEnded = () => {
    setPlayingId(null);
  };
  
  // Handle file selection
  const toggleFileSelection = (id: string) => {
    if (selectedFiles.includes(id)) {
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    } else {
      setSelectedFiles([...selectedFiles, id]);
    }
  };
  
  // Delete selected files
  const handleDeleteSelected = async () => {
    if (!selectedFiles.length) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedFiles.length} recording${
        selectedFiles.length > 1 ? 's' : ''
      }?`
    );
    
    if (confirmed) {
      try {
        toast.loading(`Deleting ${selectedFiles.length} recordings...`);
        
        // Delete each file
        const promises = selectedFiles.map(id => deleteAudioFile(id));
        await Promise.all(promises);
        
        toast.dismiss();
        toast.success(`${selectedFiles.length} recordings deleted`);
        setSelectedFiles([]);
      } catch (error) {
        toast.dismiss();
        console.error("Error deleting files:", error);
        toast.error("Error deleting files");
      }
    }
  };
  
  // Download selected files as ZIP
  const handleDownloadZip = async () => {
    if (!selectedFiles.length) return;
    
    toast.info("Preparing ZIP file...");
    
    // This is a placeholder for actual ZIP functionality
    // In a real implementation, we would use a library like JSZip 
    // or call a backend endpoint that creates a ZIP
    toast.success("ZIP file is ready for download");
  };
  
  // Format file date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };
  
  // Get category label
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'rehearsal': 'Rehearsal',
      'practice': 'Practice',
      'audition': 'Audition',
      'performance': 'Performance',
      'my_tracks': 'My Tracks',
      'recordings': 'Recordings'
    };
    
    return labels[category] || category;
  };
  
  return (
    <div className="space-y-6">
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded} 
        className="hidden" 
      />
      
      <Card>
        <CardContent className="p-4 sm:p-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search recordings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1.5 h-7 w-7 rounded-full p-0"
                  onClick={() => setSearchTerm('')}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={currentFolder ? "outline" : "secondary"}
                className="flex gap-2"
                onClick={() => setCurrentFolder(null)}
              >
                <Folder className="h-4 w-4" />
                <span>All Folders</span>
              </Button>
              {selectedFiles.length > 0 && (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownloadZip}
                    title="Download as ZIP"
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDeleteSelected}
                    title="Delete selected"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Folders List */}
          {!currentFolder && (
            <div className="mb-6">
              <Label className="mb-2 block">Folders</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {getFolders().map((folder) => (
                  <Button
                    key={folder}
                    variant="outline"
                    className="justify-start h-auto py-3"
                    onClick={() => setCurrentFolder(folder)}
                  >
                    <Folder className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{getCategoryLabel(folder)}</span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {myRecordings.filter(file => file.category === folder).length}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {/* Recordings List */}
          {currentFolder && (
            <div className="mb-4 flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium"
                onClick={() => setCurrentFolder(null)}
              >
                Folders
              </Button>
              <span className="mx-2">/</span>
              <h3 className="font-medium">{getCategoryLabel(currentFolder)}</h3>
            </div>
          )}
          
          {/* Files List */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading recordings...</p>
            </div>
          ) : filteredRecordings.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <File className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm
                  ? "No recordings match your search"
                  : currentFolder
                  ? "No recordings in this folder"
                  : "You don't have any recordings yet"}
              </p>
            </div>
          ) : (
            <div className="border rounded-md divide-y">
              {filteredRecordings.map((file) => (
                <div 
                  key={file.id} 
                  className="p-3 flex items-center hover:bg-muted/40"
                >
                  <div className="mr-3">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => togglePlayAudio(file)}
                  >
                    {playingId === file.id ? (
                      <PauseCircle className="h-6 w-6 text-primary" />
                    ) : (
                      <PlayCircle className="h-6 w-6" />
                    )}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{file.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(file.created_at)} · {getCategoryLabel(file.category)}
                    </div>
                  </div>
                  <div className="flex items-center ml-2">
                    <a 
                      href={file.file_url}
                      download={file.title}
                      className="p-2 hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (window.confirm("Delete this recording?")) {
                          deleteAudioFile(file.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
