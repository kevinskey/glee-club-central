import { useState, useEffect } from "react";
import { MediaFile } from "@/types/media";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMediaLibrary() {
  const [loading, setLoading] = useState(true);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchMediaFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setAllMediaFiles(data);
        setFilteredMediaFiles(data);
        setTotalCount(data.length);
      }
    } catch (error: any) {
      console.error("Error fetching media files:", error);
      toast("Error loading media files: " + (error.message || "An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const filterMediaFiles = () => {
    const lowercaseQuery = searchQuery.toLowerCase();
    const results = allMediaFiles.filter(
      (file) =>
        file.title.toLowerCase().includes(lowercaseQuery) ||
        (file.description && file.description.toLowerCase().includes(lowercaseQuery))
    );
    setFilteredMediaFiles(results);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    filterMediaFiles();
  }, [searchQuery, allMediaFiles]);

  const openMediaModal = (media: MediaFile) => {
    setSelectedMedia(media);
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedMedia(null);
  };

  const confirmDeleteMedia = (media: MediaFile) => {
    setMediaToDelete(media);
    setIsDeleteConfirmationOpen(true);
  };

  const cancelDeleteMedia = () => {
    setIsDeleteConfirmationOpen(false);
    setMediaToDelete(null);
  };

  const deleteMedia = async () => {
    if (!mediaToDelete) return;

    try {
      const { data, error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaToDelete.id);

      if (error) throw error;

      setAllMediaFiles(allMediaFiles.filter((media) => media.id !== mediaToDelete.id));
      setFilteredMediaFiles(filteredMediaFiles.filter((media) => media.id !== mediaToDelete.id));
      toast("Media file deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast("Error deleting media: " + (error.message || "An unexpected error occurred"));
    } finally {
      setIsDeleteConfirmationOpen(false);
      setMediaToDelete(null);
    }
  };

  const uploadMedia = async (file: File, title: string, description: string) => {
    setIsUploading(true);
    try {
      const filePath = `media/${title.replace(/\s+/g, '_')}_${Date.now()}`;
      const { data, error } = await supabase.storage
        .from('media_library')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const publicURL = supabase.storage.from('media_library').getPublicUrl(filePath);

      const { data: mediaData, error: mediaError } = await supabase
        .from('media_library')
        .insert([
          {
            title: title,
            description: description,
            file_path: filePath,
            file_url: publicURL.data.publicUrl,
          },
        ]);

      if (mediaError) throw mediaError;

      fetchMediaFiles();
      toast("Media uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading media:", error);
      toast("Error uploading media: " + (error.message || "An unexpected error occurred"));
    } finally {
      setIsUploading(false);
    }
  };

  const useMediaInContext = async (mediaId: string, contextName: string) => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .update({ context: contextName })
        .eq('id', mediaId);

      if (error) throw error;

      fetchMediaFiles();
      toast("Media context updated successfully!");
    } catch (error: any) {
      console.error("Error updating media context:", error);
      toast("Error updating media context: " + (error.message || "An unexpected error occurred"));
    }
  };

  // Effect to fetch files on component mount
  useEffect(() => {
    fetchMediaFiles();
  }, []);

  return {
    allMediaFiles,
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    loading,
    fetchMediaFiles,
    totalCount,  // Added this property to fix the error
    openMediaModal,
    closeMediaModal,
    selectedMedia,
    isMediaModalOpen,
    confirmDeleteMedia,
    cancelDeleteMedia,
    deleteMedia,
    isDeleteConfirmationOpen,
    uploadMedia,
    isUploading,
    useMediaInContext,
  };
}
