
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilesIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType, getMediaTypeLabel } from "@/utils/mediaUtils";
import { MediaFilesSection } from "@/components/media/MediaFilesSection";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { Separator } from "@/components/ui/separator";
import { AudioFile } from "@/types/audio";

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const { audioFiles } = useAudioFiles();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  
  // Fetch all media files
  const fetchAllMedia = async () => {
    setIsLoading(true);
    try {
      // Fetch files from storage
      const { data: storageFiles, error: storageError } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (storageError) throw storageError;
      
      // Convert audio files to media files format
      const audioMediaFiles: MediaFile[] = audioFiles.map(audioFile => ({
        id: audioFile.id,
        title: audioFile.title,
        description: audioFile.description,
        file_url: audioFile.file_url,
        file_path: audioFile.file_path,
        file_type: 'audio/mpeg', // Default audio type
        created_at: audioFile.created_at,
        uploaded_by: audioFile.uploaded_by
      }));
      
      // Combine all media files
      const allFiles = [
        ...(storageFiles || []), 
        ...audioMediaFiles
      ];
      
      setAllMediaFiles(allFiles);
    } catch (error: any) {
      console.error("Error fetching media files:", error);
      toast({
        title: "Error loading media",
        description: error.message || "Failed to load media files",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAllMedia();
  }, [audioFiles]); // Refetch when audio files change
  
  const handleUploadComplete = () => {
    fetchAllMedia();
  };

  // Get all media types we have files for
  const mediaTypes: MediaType[] = ["pdf", "audio", "image", "video", "other"];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Media Library"
        description="Access all your media files in one place"
        icon={<FilesIcon className="h-6 w-6" />}
        actions={
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" /> Upload Media
          </Button>
        }
      />
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {mediaTypes.map((mediaType) => (
            <React.Fragment key={mediaType}>
              <MediaFilesSection
                files={allMediaFiles}
                mediaType={mediaType}
                title={getMediaTypeLabel(mediaType)}
              />
              <Separator className="my-8" />
            </React.Fragment>
          ))}
        </>
      )}

      <UploadMediaModal 
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
