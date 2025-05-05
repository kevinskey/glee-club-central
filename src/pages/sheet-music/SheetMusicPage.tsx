import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { FileText, FolderOpen, Loader2, Upload, Search, Music, Play, Pause, ListMusic, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadSheetMusicModal } from "@/components/UploadSheetMusicModal";
import { SetlistDrawer } from "@/components/setlist/SetlistDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  file_url: string;
  created_at: string;
}

interface AudioFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
}

type SortOption = "newest" | "oldest" | "title" | "composer";

export default function SheetMusicPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audioLoading, setAudioLoading] = useState(true);
  const [musicFiles, setMusicFiles] = useState<SheetMusic[]>([]);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<SheetMusic[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSetlistDrawerOpen, setIsSetlistDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("newest");
  const [currentAudio, setCurrentAudio] = useState<AudioFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Fetch sheet music data
  const fetchSheetMusic = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sheet_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display
        const formattedData = data.map((item: SheetMusic) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString()
        }));
        
        setMusicFiles(formattedData);
        setFilteredFiles(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching sheet music:", error);
      toast({
        title: "Error loading sheet music",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch audio files
  const fetchAudioFiles = async () => {
    setAudioLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display
        const formattedData = data.map((item: AudioFile) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString()
        }));
        
        setAudioFiles(formattedData);
      }
    } catch (error: any) {
      console.error("Error fetching audio files:", error);
      toast({
        title: "Error loading audio files",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setAudioLoading(false);
    }
  };

  // Load data on initial render
  useEffect(() => {
    fetchSheetMusic();
    fetchAudioFiles();
  }, []);

  // Filter and sort music files
  useEffect(() => {
    let result = [...musicFiles];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        file => 
          file.title.toLowerCase().includes(query) || 
          file.composer.toLowerCase().includes(query) ||
          file.created_at.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOrder) {
      case "newest":
        result = result.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        result = result.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "title":
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "composer":
        result = result.sort((a, b) => a.composer.localeCompare(b.composer));
        break;
    }
    
    setFilteredFiles(result);
  }, [searchQuery, musicFiles, sortOrder]);

  // Audio playback control
  const togglePlayPause = (audioFile: AudioFile) => {
    if (currentAudio && currentAudio.id === audioFile.id) {
      // Same audio file - toggle play/pause
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // New audio file selected
      setCurrentAudio(audioFile);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioFile.file_url;
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    // Set up audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }

    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Music Library"
        description="Access sheet music and audio recordings"
        icon={<FileText className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
          >
            <Upload className="h-4 w-4" /> Upload PDF
          </Button>
        }
      />

      {/* Search bar at the top */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, composer or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as SortOption)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="composer">Composer (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          className="md:hidden gap-2 w-full"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="h-4 w-4" /> Upload Sheet Music
        </Button>
      </div>

      {/* Sheet Music Content */}
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sheet Music Collection</h2>
          <div className="flex items-center gap-2">
            {/* Add Create Setlist button next to the grid view buttons */}
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsSetlistDrawerOpen(true)}
            >
              <Plus className="h-4 w-4" /> Create Setlist
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex items-center gap-1 ml-2"
              onClick={() => setIsSetlistDrawerOpen(true)}
            >
              <ListMusic className="h-4 w-4" /> View Setlists
            </Button>
            <TabsList>
              <TabsTrigger value="grid" className="flex items-center gap-1">
                <FolderOpen className="h-4 w-4" /> Grid View
              </TabsTrigger>
              <TabsTrigger value="table" className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Table View
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        {loading ? (
          <div className="flex h-[200px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">No sheet music found</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Be the first to upload sheet music for the choir."}
            </p>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
            >
              <Upload className="h-4 w-4" /> Upload Sheet Music
            </Button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            <TabsContent value="grid" className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="overflow-hidden">
                    <Link to={`/dashboard/sheet-music/${file.id}`} className="block h-full">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        <FileText className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium truncate">{file.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{file.composer}</p>
                        <p className="text-xs text-muted-foreground mt-2">{file.created_at}</p>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Table View */}
            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Title</TableHead>
                      <TableHead className="w-[25%]">Composer</TableHead>
                      <TableHead className="w-[20%]">Upload Date</TableHead>
                      <TableHead className="w-[15%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFiles.map((file) => (
                      <TableRow key={file.id}>
                        <TableCell className="font-medium">{file.title}</TableCell>
                        <TableCell>{file.composer}</TableCell>
                        <TableCell>{file.created_at}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="default" 
                            size="sm"
                            asChild
                          >
                            <Link to={`/dashboard/sheet-music/${file.id}`}>
                              View PDF
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Audio Library Section */}
      <div className="pt-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Music className="h-5 w-5" /> Audio Library
          </h2>
          <Button 
            variant="outline" 
            className="text-sm gap-1"
            onClick={() => window.location.href = "/dashboard/audio-management"}
          >
            <Upload className="h-4 w-4" /> Manage Audio
          </Button>
        </div>

        {audioLoading ? (
          <div className="flex h-[100px] w-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : audioFiles.length === 0 ? (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-6 px-4 text-center">
              <Music className="h-10 w-10 mb-2 text-muted-foreground" />
              <h3 className="font-medium">No audio files yet</h3>
              <p className="text-sm text-muted-foreground">
                Visit the Audio Management page to upload audio files.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audioFiles.map((audio) => (
              <Card key={audio.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{audio.title}</h3>
                      {audio.description && (
                        <p className="text-sm text-muted-foreground truncate">{audio.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{audio.created_at}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 ml-2"
                      onClick={() => togglePlayPause(audio)}
                    >
                      {currentAudio?.id === audio.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modals and Drawers */}
      <UploadSheetMusicModal 
        onUploadComplete={fetchSheetMusic}
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
      />

      <SetlistDrawer
        open={isSetlistDrawerOpen}
        onOpenChange={setIsSetlistDrawerOpen}
      />
    </div>
  );
}
