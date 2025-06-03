import { useState, useEffect } from "react";
import { MediaFile } from "@/types/media";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MediaType } from "@/utils/mediaUtils";
import { removeMediaFromHeroSlides } from "@/utils/heroMediaSync";

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
  
  // Added missing properties
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<"newest" | "oldest">("newest");
  const [error, setError] = useState<Error | null>(null);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Added mediaStats for components that might expect it
  const [mediaStats, setMediaStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    filesByType: {}
  });

  const fetchMediaFiles = async () => {
    setLoading(true);
    setError(null);
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
        
        // Extract and set media types and categories
        const types = [...new Set(data.map(file => file.file_type.split('/')[0]))];
        setMediaTypes(types);
        
        const cats = [...new Set(data.filter(file => file.category).map(file => file.category || ""))];
        setCategories(cats);
        
        // Calculate media stats
        const stats = {
          totalFiles: data.length,
          totalSize: data.reduce((sum, file) => sum + (file.size || 0), 0),
          filesByType: data.reduce((acc, file) => {
            const type = file.file_type.split('/')[0];
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        };
        setMediaStats(stats);
      }
    } catch (error: any) {
      console.error("Error fetching media files:", error);
      setError(error);
      toast("Error loading media files: " + (error.message || "An unexpected error occurred"));
    } finally {
      setLoading(false);
    }
  };

  const filterMediaFiles = () => {
    let results = [...allMediaFiles];
    
    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        (file) =>
          file.title.toLowerCase().includes(lowercaseQuery) ||
          (file.description && file.description.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Filter by media type
    if (selectedMediaType !== "all") {
      results = results.filter(file => file.file_type.startsWith(selectedMediaType));
    }
    
    // Filter by category
    if (selectedCategory) {
      results = results.filter(file => file.category === selectedCategory);
    }
    
    // Sort by date
    results.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateFilter === "newest" ? dateB - dateA : dateA - dateB;
    });
    
    setFilteredMediaFiles(results);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    filterMediaFiles();
  }, [searchQuery, selectedMediaType, selectedCategory, dateFilter, allMediaFiles]);

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
      console.log(`🗑️ Deleting media file: ${mediaToDelete.id}`);
      
      // First, clean up any hero slides that reference this media
      await removeMediaFromHeroSlides(mediaToDelete.id);

      // Then delete the media file
      const { data, error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaToDelete.id);

      if (error) throw error;

      setAllMediaFiles(allMediaFiles.filter((media) => media.id !== mediaToDelete.id));
      setFilteredMediaFiles(filteredMediaFiles.filter((media) => media.id !== mediaToDelete.id));
      toast.success("Media file deleted successfully!");
      
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast.error("Error deleting media: " + (error.message || "An unexpected error occurred"));
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
  
  // Added new function for deleting a media item
  const deleteMediaItem = async (mediaId: string) => {
    try {
      console.log(`🗑️ Deleting media item: ${mediaId}`);
      
      // First, clean up any hero slides that reference this media
      await removeMediaFromHeroSlides(mediaId);

      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;

      setAllMediaFiles(allMediaFiles.filter((media) => media.id !== mediaId));
      setFilteredMediaFiles(filteredMediaFiles.filter((media) => media.id !== mediaId));
      toast.success("Media file deleted successfully!");
      return true;
    } catch (error: any) {
      console.error("Error deleting media:", error);
      toast.error("Error deleting media: " + (error.message || "An unexpected error occurred"));
      return false;
    }
  };
  
  // Added fetchAllMedia alias for clarity
  const fetchAllMedia = () => {
    return fetchMediaFiles();
  };

  // Effect to fetch files on component mount
  useEffect(() => {
    fetchMediaFiles();
  }, []);

  // Fix the date filter typing issue by creating a properly typed setter function
  const setDateFilterSafe = (filter: string) => {
    if (filter === "newest" || filter === "oldest") {
      setDateFilter(filter);
    }
  };

  return {
    allMediaFiles,
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    loading,
    fetchMediaFiles,
    totalCount,
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
    // Added missing properties
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter: setDateFilterSafe, // Use the type-safe wrapper function
    isLoading: loading,
    error,
    mediaTypes,
    categories,
    fetchAllMedia,
    deleteMediaItem,
    mediaStats
  };
}
