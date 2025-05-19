
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, MediaStats } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { toast } from "sonner";

export function useMediaLibrary() {
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [mediaStats, setMediaStats] = useState<MediaStats>({
    totalFiles: 0,
    totalSize: 0,
    filesByType: {}
  });

  // Fetch all media files
  const fetchAllMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw new Error(error.message);
      
      // Convert to MediaFile type
      const mediaFiles = data as MediaFile[];
      
      // Calculate statistics
      const stats: MediaStats = {
        totalFiles: mediaFiles.length,
        totalSize: mediaFiles.reduce((sum, file) => sum + (file.size || 0), 0),
        filesByType: {}
      };
      
      // Extract unique categories and media types
      const uniqueCategories = new Set<string>();
      const uniqueMediaTypes = new Set<string>();
      
      mediaFiles.forEach(file => {
        const mediaType = getMediaType(file.file_type);
        
        // Add to categories
        if (file.folder) {
          uniqueCategories.add(file.folder);
        } else if (file.category) {
          uniqueCategories.add(file.category);
        }
        
        // Add to media types
        uniqueMediaTypes.add(mediaType);
        
        // Update stats
        if (!stats.filesByType[mediaType]) {
          stats.filesByType[mediaType] = 0;
        }
        stats.filesByType[mediaType]++;
      });
      
      setAllMediaFiles(mediaFiles);
      setFilteredMediaFiles(mediaFiles);
      setCategories(Array.from(uniqueCategories));
      setMediaTypes(Array.from(uniqueMediaTypes));
      setMediaStats(stats);
      
    } catch (err) {
      console.error("Error fetching media files:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (!allMediaFiles) return;
    
    let filtered = [...allMediaFiles];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(query) || 
        (file.description && file.description.toLowerCase().includes(query)) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply media type filter
    if (selectedMediaType !== "all") {
      filtered = filtered.filter(file => 
        getMediaType(file.file_type) === selectedMediaType
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(file => 
        (file.folder === selectedCategory || file.category === selectedCategory)
      );
    }
    
    // Apply date filter
    if (dateFilter === "newest") {
      filtered.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (dateFilter === "oldest") {
      filtered.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    
    setFilteredMediaFiles(filtered);
  }, [allMediaFiles, searchQuery, selectedMediaType, selectedCategory, dateFilter]);

  // Load media on component mount
  useEffect(() => {
    fetchAllMedia();
  }, [fetchAllMedia]);

  // Delete a media item
  const deleteMediaItem = async (mediaId: string) => {
    try {
      const result = await supabase
        .from('media_library')
        .select('file_path')
        .eq('id', mediaId)
        .single();
      
      if (result.error) throw new Error(result.error.message);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media-library')
        .remove([result.data.file_path]);
        
      if (storageError) throw new Error(storageError.message);
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaId);
        
      if (dbError) throw new Error(dbError.message);
      
      toast.success("Media deleted successfully");
      
      // Update the local state
      setAllMediaFiles(prevFiles => prevFiles.filter(file => file.id !== mediaId));
      setFilteredMediaFiles(prevFiles => prevFiles.filter(file => file.id !== mediaId));
      
      return true;
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Error deleting media", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      throw error;
    }
  };

  // Use media in a specific context (hero, press-kit, etc)
  const useMediaInContext = async (mediaId: string, contextName: string) => {
    try {
      // This is where we would implement the logic to use this media in a specific context
      // For example, add it to the hero images or press kit
      toast.success(`Media selected for ${contextName}`);
      return true;
    } catch (error) {
      console.error(`Error using media in ${contextName}:`, error);
      toast.error(`Error using in ${contextName}`, {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
      return false;
    }
  };

  return {
    allMediaFiles,
    filteredMediaFiles,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    isLoading,
    error,
    categories,
    mediaTypes,
    mediaStats,
    fetchAllMedia,
    deleteMediaItem,
    useMediaInContext
  };
}
