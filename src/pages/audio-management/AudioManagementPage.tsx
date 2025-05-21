
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AudioCategorySelector } from "@/components/audio/AudioCategorySelector";
import { AudioFilesList } from "@/components/audio/AudioFilesList";
import { AudioSearchAndFilter } from "@/components/audio/AudioSearchAndFilter";
import { Button } from "@/components/ui/button";
import { UploadCloud, Music } from "lucide-react";
import { MusicAppHeader } from "@/components/layout/MusicAppHeader";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { AudioFile, AudioPageCategory } from "@/types/audio";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { useBackingTracks } from "@/hooks/useBackingTracks";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export default function AudioManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const [category, setCategory] = useState<AudioPageCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isBackingTrack, setIsBackingTrack] = useState(false);
  
  const { 
    loading, 
    audioFiles, 
    fetchAudioFiles, 
    deleteAudioFile 
  } = useAudioFiles();

  const { markAsBackingTrack } = useBackingTracks();

  // Filter audio files based on category and search query
  const getFilteredAudioFiles = () => {
    if (!audioFiles) return [];
    
    let filtered = [...audioFiles];
    
    // Filter by category if not "all"
    if (category !== "all") {
      if (category === "backing_tracks") {
        filtered = filtered.filter(file => file.is_backing_track);
      } else {
        filtered = filtered.filter(file => file.category === category);
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(query) ||
        (file.description && file.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const canDeleteFile = (uploadedBy: string) => {
    if (!user) return false;
    return user.id === uploadedBy;
  };

  const confirmDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this audio file?");
    if (confirm) {
      await deleteAudioFile(id);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title || !user) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Create FormData to send file
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("userId", user.id);
    formData.append("category", category === "all" ? "recordings" : category);
    formData.append("isBackingTrack", isBackingTrack ? "true" : "false");
    
    try {
      toast.loading("Uploading audio file...");
      
      // Call your upload API endpoint
      const response = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }
      
      toast.dismiss();
      toast.success("Audio file uploaded successfully");
      
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setIsBackingTrack(false);
      setIsUploadDialogOpen(false);
      
      // Refresh files list
      fetchAudioFiles();
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(`Upload failed: ${error.message}`);
    }
  };

  const toggleBackingTrackStatus = async (file: AudioFile) => {
    const newStatus = !file.is_backing_track;
    const success = await markAsBackingTrack(file.id, newStatus);
    
    if (success) {
      // Update local state
      fetchAudioFiles();
      toast.success(`File marked as ${newStatus ? 'backing track' : 'regular audio'}`);
    }
  };

  // Fetch audio files on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchAudioFiles();
    }
  }, [isAuthenticated]);

  const displayFiles = getFilteredAudioFiles();

  return (
    <>
      <MusicAppHeader currentSection="audio" />
      <div className="container py-6">
        <PageHeader
          title="Audio Management"
          description="Upload and manage audio files for practice and recordings"
          icon={<Music className="h-6 w-6" />}
        />

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <AudioCategorySelector
                value={category}
                onChange={(value) => setCategory(value as AudioPageCategory)}
                includeBackingTracks
              />

              <div className="flex items-center gap-2">
                <AudioSearchAndFilter 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery}
                  activeCategory={category}
                  setActiveCategory={setCategory} 
                />
                
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UploadCloud className="h-4 w-4" />
                      <span className="hidden sm:inline">Upload</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Audio File</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter file title"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Optional description"
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <AudioCategorySelector
                          value={category === "all" ? "recordings" : category}
                          onChange={(value) => setCategory(value as AudioPageCategory)}
                          includeBackingTracks
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="backing-track"
                          checked={isBackingTrack}
                          onCheckedChange={setIsBackingTrack}
                        />
                        <Label htmlFor="backing-track">Mark as backing track for karaoke</Label>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="audio-file">Audio File *</Label>
                        <Input
                          id="audio-file"
                          type="file"
                          accept="audio/*"
                          onChange={handleFileChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Accepted formats: MP3, WAV, OGG, WEBM (max 10MB)
                        </p>
                      </div>
                      
                      <DialogFooter>
                        <Button type="submit">Upload Audio</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <AudioFilesList
              loading={loading}
              displayFiles={displayFiles}
              category={category}
              searchQuery={searchQuery}
              canDeleteFile={canDeleteFile}
              confirmDelete={confirmDelete}
              onUploadClick={(cat) => {
                if (cat) setCategory(cat as AudioPageCategory);
                setIsUploadDialogOpen(true);
              }}
              renderAdditionalActions={(file) => (
                <DropdownMenuItem onSelect={(e) => {
                  e.preventDefault();
                  toggleBackingTrackStatus(file);
                }}>
                  {file.is_backing_track 
                    ? "Unmark as backing track" 
                    : "Mark as backing track"}
                </DropdownMenuItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
