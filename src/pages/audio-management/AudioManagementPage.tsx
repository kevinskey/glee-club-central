
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Headphones, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UploadAudioModal } from "@/components/UploadAudioModal";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { AudioPageCategory } from "@/types/audio";
import { AudioSearchAndFilter } from "@/components/audio/AudioSearchAndFilter";
import { AudioFilesList } from "@/components/audio/AudioFilesList";
import { DeleteAudioDialog } from "@/components/audio/DeleteAudioDialog";
import { RecordingSection } from "@/components/audio/RecordingSection";

export default function AudioManagementPage() {
  const { user } = useAuth();
  const { loading, audioFiles, fetchAudioFiles, deleteAudioFile } = useAudioFiles();
  const [filteredFiles, setFilteredFiles] = useState(audioFiles);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AudioPageCategory>("all");
  const [uploadCategory, setUploadCategory] = useState<Exclude<AudioPageCategory, "all">>("recordings");
  
  // Filter audio files based on search and category
  React.useEffect(() => {
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
  
  // Handle recording saved
  const handleRecordingSaved = (category?: Exclude<AudioPageCategory, "all">) => {
    fetchAudioFiles();
    if (category) {
      setActiveCategory(category);
    }
  };

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
      <RecordingSection onRecordingSaved={handleRecordingSaved} />

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
