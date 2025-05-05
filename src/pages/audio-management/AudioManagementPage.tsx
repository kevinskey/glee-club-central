
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { 
  Music, Upload, Loader2, Trash2, 
  FileAudio, Search, Download
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

interface AudioFile {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  created_at: string;
  uploaded_by: string;
}

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
        // Format dates for display
        const formattedData = data.map((item: AudioFile) => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleDateString()
        }));
        
        setAudioFiles(formattedData);
        setFilteredFiles(formattedData);
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

  // Filter audio files based on search
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = audioFiles.filter(
        file => 
          file.title.toLowerCase().includes(query) || 
          (file.description && file.description.toLowerCase().includes(query)) ||
          file.created_at.toLowerCase().includes(query)
      );
      setFilteredFiles(filtered);
    } else {
      setFilteredFiles(audioFiles);
    }
  }, [searchQuery, audioFiles]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audio Management"
        description="Upload and manage audio files for the choir"
        icon={<Music className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gap-2 bg-glee-purple hover:bg-glee-purple/90"
          >
            <Upload className="h-4 w-4" /> Upload Audio
          </Button>
        }
      />

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audio files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          className="sm:hidden gap-2"
          onClick={() => setIsUploadModalOpen(true)}
        >
          <Upload className="h-4 w-4" /> Upload Audio
        </Button>
      </div>

      {/* Audio Files List/Table */}
      {loading ? (
        <div className="flex h-[200px] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <FileAudio className="h-16 w-16 mb-4 text-muted-foreground" />
            <h3 className="text-xl font-medium mb-2">No audio files found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? "Try a different search term" : "Upload audio files for choir members to access"}
            </p>
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> Upload First Audio File
            </Button>
          </CardContent>
        </Card>
      ) : (
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
              {filteredFiles.map((file) => (
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
      )}

      {/* Upload Modal */}
      <UploadAudioModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={fetchAudioFiles}
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
