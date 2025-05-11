
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, MediaStats } from "@/types/media";
import { MediaType, getMediaType } from "@/utils/mediaUtils";
import { toast } from "sonner";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { useAuth } from "@/contexts/AuthContext";

export function useMediaLibrary() {
  const { audioFiles, loading: audioLoading } = useAudioFiles();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [dateFilter, setDateFilter] = useState<"newest" | "oldest">("newest");
  
  // Get all media types we have files for
  const mediaTypes: MediaType[] = ["pdf", "audio", "image", "video", "other"];
  
  // Get unique categories from files
  const categories = Array.from(
    new Set(allMediaFiles.map(file => file.category).filter(Boolean))
  );

  // Fetch all media files with RLS automatically handling permission
  const fetchAllMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching media files...");
      // Fetch files from media_library table
      const { data: storageFiles, error: storageError } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: dateFilter === "oldest" });
      
      if (storageError) {
        console.error("Error fetching from media_library:", storageError);
        throw storageError;
      }
      
      console.log("Media files fetched:", storageFiles?.length || 0);
      
      // Convert audio files to media files format, ensuring all required fields are present
      // But only include personal recordings (my_tracks category)
      const audioMediaFiles: MediaFile[] = audioFiles
        .filter(audioFile => audioFile.category === "my_tracks" && audioFile.uploaded_by === user?.id)
        .map(audioFile => ({
          id: audioFile.id,
          title: audioFile.title,
          description: audioFile.description,
          file_url: audioFile.file_url,
          file_path: audioFile.file_path,
          file_type: 'audio/mpeg', // Default audio type
          created_at: audioFile.created_at,
          uploaded_by: audioFile.uploaded_by,
          category: 'audio',
          tags: [],
          size: 0 // Default size for audio files since we don't have this info
        }));
      
      console.log("Audio files converted:", audioMediaFiles.length);
      
      // Combine all media files, ensuring proper type casting for storageFiles
      const typedStorageFiles = storageFiles?.map(file => {
        // Extract all properties from the file object
        const mediaFile: MediaFile = {
          id: file.id,
          title: file.title,
          description: file.description,
          file_url: file.file_url,
          file_path: file.file_path,
          file_type: file.file_type,
          created_at: file.created_at,
          uploaded_by: file.uploaded_by,
          category: file.folder || getMediaType(file.file_type), // Use folder as category or derive from file type
          tags: file.tags || [],
          size: 0 // Default to 0 since size might not exist in some records
        };
        return mediaFile;
      }) || [];
      
      const combinedFiles = [
        ...typedStorageFiles,
        ...audioMediaFiles
      ];
      
      console.log("Combined total files:", combinedFiles.length);
      setAllMediaFiles(combinedFiles);
      
      // Calculate statistics
      const stats: MediaStats = {
        totalFiles: combinedFiles.length,
        totalSize: combinedFiles.reduce((total, file) => total + (file.size || 0), 0),
        filesByType: {}
      };
      
      // Count files by type
      combinedFiles.forEach(file => {
        const type = getMediaType(file.file_type);
        if (!stats.filesByType[type]) {
          stats.filesByType[type] = 0;
        }
        stats.filesByType[type]++;
      });
      
      setMediaStats(stats);
      
      // Apply filters to the combined files
      applyFilters(combinedFiles, searchQuery, selectedMediaType, selectedCategory);
    } catch (error: any) {
      console.error("Error fetching media files:", error);
      setError(error instanceof Error ? error : new Error("Failed to load media files"));
      toast("Error loading media", {
        description: error.message || "Failed to load media files",
      });
    } finally {
      setIsLoading(false);
    }
  }, [audioFiles, user?.id, dateFilter, searchQuery, selectedMediaType, selectedCategory]);

  // Apply filters to media files
  const applyFilters = useCallback((
    files: MediaFile[], 
    query: string, 
    mediaTypeFilter: MediaType | "all",
    categoryFilter: string | "all"
  ) => {
    let filtered = [...files];
    
    // Apply search query filter
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(lowerQuery) || 
        (file.description && file.description.toLowerCase().includes(lowerQuery)) ||
        (file.tags && file.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    }
    
    // Apply media type filter
    if (mediaTypeFilter !== "all") {
      filtered = filtered.filter(file => getMediaType(file.file_type) === mediaTypeFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(file => file.category === categoryFilter);
    }
    
    setFilteredMediaFiles(filtered);
    console.log("Filtered files:", filtered.length);
  }, []);

  // Update filters whenever the dependencies change
  useEffect(() => {
    if (allMediaFiles.length > 0) {
      applyFilters(allMediaFiles, searchQuery, selectedMediaType, selectedCategory);
    }
  }, [allMediaFiles, searchQuery, selectedMediaType, selectedCategory, applyFilters]);

  // Initial fetch on component mount
  useEffect(() => {
    console.log("MediaLibraryPage: Initial render, fetching data");
    fetchAllMedia();
  }, [audioFiles, dateFilter, fetchAllMedia]); // Refetch when audio files or date filter change
  
  return {
    isLoading,
    error,
    mediaStats,
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
    mediaTypes,
    categories,
    fetchAllMedia, // Exposed for refresh after operations
  };
}
