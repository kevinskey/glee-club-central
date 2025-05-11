
import { useState, useEffect } from "react";
import { MediaFile, MediaStats } from "@/types/media";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useMediaLibrary() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  const { toast } = useToast();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  
  // Derived values
  const mediaTypes = Array.from(new Set(mediaFiles.map(file => file.file_type)));
  const categories = Array.from(new Set(mediaFiles.map(file => file.category || "general")));
  
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
    if (selectedMediaType) {
      filtered = filtered.filter(file => file.file_type === selectedMediaType);
    }
    
    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }
    
    // Apply date filter
    if (dateFilter) {
      // Parse date string to a Date object
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(file => {
        const fileDate = new Date(file.created_at);
        return fileDate.toDateString() === filterDate.toDateString();
      });
    }
    
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
