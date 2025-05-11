
import { useState, useEffect } from "react";
import { MediaFile, MediaStats } from "@/types/media";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { MediaType } from "@/utils/mediaUtils";

export function useMediaLibrary() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  const { toast } = useToast();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [dateFilter, setDateFilter] = useState<"newest" | "oldest">("newest");
  
  // Derived values
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Fetch all media
  const fetchAllMedia = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch media files from Supabase
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Map data to MediaFile type
      const mappedData = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        file_url: item.file_url,
        file_path: item.file_path,
        file_type: item.file_type,
        uploaded_by: item.uploaded_by,
        category: item.folder || 'general',
        tags: item.tags || [],
        created_at: item.created_at,
        size: item.size || 0,
      }));
      
      setMediaFiles(mappedData);
      setFilteredMediaFiles(mappedData);
      
      // Calculate stats
      const stats: MediaStats = {
        totalFiles: mappedData.length,
        totalSize: mappedData.reduce((sum, file) => sum + (file.size || 0), 0),
        filesByType: {}
      };
      
      // Count files by type
      mappedData.forEach(file => {
        const type = file.file_type.split('/')[0];
        
        // Initialize if first encounter
        if (!stats.filesByType[type]) {
          stats.filesByType[type] = 0;
        }
        
        // Increment counter
        stats.filesByType[type]++;
      });
      
      setMediaStats(stats);
      
      // Extract available media types and categories from data
      const types = Array.from(new Set(
        mappedData.map(file => {
          if (file.file_type.startsWith('audio/')) return 'audio';
          if (file.file_type.startsWith('image/')) return 'image';
          if (file.file_type.startsWith('video/')) return 'video';
          if (file.file_type === 'application/pdf') return 'pdf';
          return 'other';
        })
      )) as MediaType[];
      
      setMediaTypes(types);
      
      const cats = Array.from(new Set(mappedData.map(file => file.category || "general")));
      setCategories(cats);
      
    } catch (err: any) {
      console.error('Error fetching media:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete media item
  const deleteMediaItem = async (mediaId: string) => {
    try {
      // Find the file to delete
      const fileToDelete = mediaFiles.find(f => f.id === mediaId);
      if (!fileToDelete) {
        throw new Error("Media file not found");
      }
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media-library')
        .remove([fileToDelete.file_path]);
        
      if (storageError) throw storageError;
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', mediaId);
        
      if (dbError) throw dbError;
      
      toast({
        title: "Media deleted",
        description: "The media file has been successfully deleted",
      });
      
      return true;
    } catch (err: any) {
      console.error('Error deleting media:', err);
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete media file",
        variant: "destructive"
      });
      throw err;
    }
  };
  
  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (mediaFiles.length === 0) return;
    
    let filtered = [...mediaFiles];
    
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
      filtered = filtered.filter(file => {
        if (selectedMediaType === 'audio') return file.file_type.startsWith('audio/');
        if (selectedMediaType === 'image') return file.file_type.startsWith('image/');
        if (selectedMediaType === 'video') return file.file_type.startsWith('video/');
        if (selectedMediaType === 'pdf') return file.file_type === 'application/pdf';
        return !file.file_type.startsWith('audio/') && 
               !file.file_type.startsWith('image/') && 
               !file.file_type.startsWith('video/') && 
               file.file_type !== 'application/pdf';
      });
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }
    
    // Apply date sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      
      return dateFilter === "newest" 
        ? dateB - dateA  // newest first
        : dateA - dateB; // oldest first
    });
    
    setFilteredMediaFiles(filtered);
    
  }, [searchQuery, selectedMediaType, selectedCategory, dateFilter, mediaFiles]);
  
  // Initial fetch
  useEffect(() => {
    fetchAllMedia();
  }, []);
  
  return {
    isLoading,
    error,
    mediaFiles,
    filteredMediaFiles,
    mediaStats,
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
    fetchAllMedia,
    deleteMediaItem
  };
}
