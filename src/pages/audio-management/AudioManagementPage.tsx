import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Music, Upload, Loader2, Trash2, 
  FileAudio, Search, Download,
  ListMusic, AudioLines
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UploadAudioModal } from "@/components/UploadAudioModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AudioCategory } from "@/components/audio/audioCategoryUtils";

interface AudioFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_path: string;
  created_at: string;
  uploaded_by: string;
  category: string;  // Added category property to fix the TypeScript error
}

type AudioPageCategory = AudioCategory | "all";

export default function AudioManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<AudioFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AudioPageCategory>("all");
  const [uploadCategory, setUploadCategory] = useState<Exclude<AudioPageCategory, "all">>("part_tracks");
  
  // Fetch audio files
  const fetchAudioFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Format dates for display and ensure category exists
        const formattedData = data.map((item) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString(),
          // Default category to "recordings" for legacy files
          category: item.category || "recordings"
        }));
        
        setAudioFiles(formattedData);
        applyFilters(formattedData, activeCategory, searchQuery);
      }
    } catch (error: any) {
      console.error("Error fetching audio files:", error);
      toast({
        title: "Error loading audio files",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  // Filter audio files based on search and category
  const applyFilters = (files: AudioFile[], category: AudioPageCategory, query: string) => {
    let results = files;
    
    // Apply category filter
    if (category !== "all") {
      results = files.filter(file => file.category === category);
    }
    
    // Apply search filter if there's a query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      results = results.filter(
        file => 
          file.title.toLowerCase().includes(lowercaseQuery) || 
          (file.description && file.description.toLowerCase().includes(lowercaseQuery)) ||
          file.created_at.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredFiles(results);
  };
  
  // Update filters when search query or category changes
  useEffect(() => {
    applyFilters(audioFiles, activeCategory, searchQuery);
  }, [searchQuery, activeCategory, audioFiles]);

  // Open delete confirmation dialog
  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Delete audio file
  const deleteAudioFile = async () => {
    if (!deleteId) return;
    
    try {
      // First get the file path to delete from storage
      const { data: fileData } = await supabase
        .from('audio_files')
        .select('file_path')
        .eq('id', deleteId)
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
        .eq('id', deleteId);
        
      if (dbError) throw dbError;
      
      // Update UI
      setAudioFiles(audioFiles.filter(file => file.id !== deleteId));
      
      toast({
        title: "Audio file deleted",
        description: "The audio file has been successfully deleted.",
      });
    } catch (error: any) {
      console.error("Error deleting audio file:", error);
      toast({
        title: "Error deleting audio file",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Check if user can delete a file (if they uploaded it)
  const canDeleteFile = (uploadedBy: string) => {
    return user?.id === uploadedBy;
  };
  
  // Check if the current category has no files
  const categoryHasNoFiles = (category: AudioPageCategory) => {
    if (category === "all") {
      return audioFiles.length === 0;
    }
    return !audioFiles.some(file => file.category === category);
  };
  
  // Get the icon for each category
  const getCategoryIcon = (category: AudioPageCategory) => {
    switch (category) {
      case "part_tracks":
        return <ListMusic className="h-16 w-16 text-muted-foreground" />;
      case "recordings":
        return <AudioLines className="h-16 w-16 text-muted-foreground" />;
      case "my_tracks":
        return <FileAudio className="h-16 w-16 text-muted-foreground" />;
      default:
        return <FileAudio className="h-16 w-16 text-muted-foreground" />;
    }
  };
  
  // Get display name for each category
  const getCategoryName = (category: AudioPageCategory): string => {
    switch (category) {
      case "part_tracks":
        return "Part Tracks";
      case "recordings":
        return "Recordings";
      case "my_tracks":
        return "My Tracks";
      case "all":
        return "All Audio";
    }
  };
  
  // Handle opening the upload modal
  const handleOpenUploadModal = (category?: Exclude<AudioPageCategory, "all">) => {
    if (category) {
      setUploadCategory(category);
    }
    setIsUploadModalOpen(true);
  };

  // Fix type comparison error by using different comparison logic
  function renderAudioFiles(category: AudioPageCategory) {
    if (loading) {
      return (
        <div className="flex h-[200px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    // Check if there are no audio files for this category or search
    const hasNoFiles = category === "all" 
      ? filteredFiles.length === 0
      : !filteredFiles.some(file => file.category === category);
      
    if (hasNoFiles) {
      const isSearching = searchQuery.trim().length > 0;
      
      return (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
            {getCategoryIcon(category)}
            <h3 className="text-xl font-medium mb-2">
              {isSearching 
                ? "No matching audio files found" 
                : `No ${getCategoryName(category).toLowerCase()} found`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isSearching 
                ? "Try a different search term" 
                : `Upload ${getCategoryName(category).toLowerCase()} for choir members to access`}
            </p>
            <Button 
              onClick={() => handleOpenUploadModal(category === "all" ? "recordings" : (category as Exclude<AudioPageCategory, "all">))}
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> 
              Upload {category === "all" ? "Audio" : getCategoryName(category)}
            </Button>
          </CardContent>
        </Card>
      );
    }

    // Filter files for this category if not "all"
    const displayFiles = category === "all" 
      ? filteredFiles 
      : filteredFiles.filter(file => file.category === category);

    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Title</TableHead>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead className="w-[15%]">Date Uploaded</TableHead>
              <TableHead className="w-[15%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">{file.title}</TableCell>
                <TableCell>{file.description || "-"}</TableCell>
                <TableCell>{file.created_at}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.file_url, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    
                    {canDeleteFile(file.uploaded_by) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audio Management"
        description="Upload and manage audio files for the choir"
        icon={<Music className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => handleOpenUploadModal()}
            className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
          >
            <Upload className="h-4 w-4" /> Upload Audio
          </Button>
        }
      />

      {/* Tabs and Search */}
      <div className="flex flex-col gap-4">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={(val) => setActiveCategory(val as AudioPageCategory)}>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <TabsList className="mb-2 sm:mb-0">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="part_tracks">Part Tracks</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
              <TabsTrigger value="my_tracks">My Tracks</TabsTrigger>
            </TabsList>
            
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search audio files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Audio Files List/Table for each tab */}
          <TabsContent value="all" className="mt-4">
            {renderAudioFiles("all")}
          </TabsContent>
          
          <TabsContent value="part_tracks" className="mt-4">
            {renderAudioFiles("part_tracks")}
          </TabsContent>
          
          <TabsContent value="recordings" className="mt-4">
            {renderAudioFiles("recordings")}
          </TabsContent>
          
          <TabsContent value="my_tracks" className="mt-4">
            {renderAudioFiles("my_tracks")}
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Modal */}
      <UploadAudioModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={fetchAudioFiles}
        defaultCategory={uploadCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the audio file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteAudioFile} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
