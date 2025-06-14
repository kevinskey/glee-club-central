import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MediaType } from '@/utils/mediaUtils';

interface MediaFile {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_path: string;
  file_type: string;
  file_size?: number;
  size?: number;
  uploaded_by: string;
  category?: string;
  folder?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export function useMediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      const files = (data || []).map(file => {
        // Ensure file URLs are properly formatted for Supabase storage
        let fileUrl = file.file_url;
        if (!fileUrl.startsWith('http') && file.file_path) {
          fileUrl = `https://dzzptovqfqausipsgabw.supabase.co/storage/v1/object/public/media-library/${file.file_path}`;
        }
        
        console.log(`Processing media file: ${file.title}, Type: ${file.file_type}, URL: ${fileUrl}`);
        
        return {
          ...file,
          file_url: fileUrl,
          description: file.description || '',
          file_path: file.file_path || '',
          size: file.size || file.file_size || 0,
          file_size: file.size || file.file_size || 0,
          category: file.category || file.folder || 'general',
          folder: file.folder || 'general',
          tags: file.tags || []
        };
      });
      
      setMediaFiles(files);
      setAllMediaFiles(files);
      setFilteredMediaFiles(files);
    } catch (err) {
      console.error('Error fetching media files:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch media files');
      toast.error('Failed to load media files');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllMedia = fetchMediaFiles;

  const uploadMediaFile = async (file: File, title?: string, isPublic: boolean = false) => {
    try {
      // Upload file to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `media/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      // Insert media record
      const { data: mediaRecord, error: insertError } = await supabase
        .from('media_library')
        .insert({
          title: title || file.name,
          file_url: publicUrl,
          file_path: filePath,
          file_type: file.type,
          size: file.size,
          is_public: isPublic,
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh media files list
      await fetchMediaFiles();

      toast.success('Media file uploaded successfully');
      return mediaRecord;
    } catch (err) {
      console.error('Error uploading media file:', err);
      toast.error('Failed to upload media file');
      throw err;
    }
  };

  const deleteMediaFile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await fetchMediaFiles();
      toast.success('Media file deleted successfully');
    } catch (err) {
      console.error('Error deleting media file:', err);
      toast.error('Failed to delete media file');
      throw err;
    }
  };

  const deleteMediaItem = deleteMediaFile;

  const updateMediaFile = async (id: string, updates: { title?: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setMediaFiles(prev => prev.map(file => 
        file.id === id ? { ...file, ...updates } : file
      ));
      setAllMediaFiles(prev => prev.map(file => 
        file.id === id ? { ...file, ...updates } : file
      ));

      toast.success('Media updated successfully');
    } catch (err) {
      console.error('Error updating media file:', err);
      toast.error('Failed to update media file');
      throw err;
    }
  };

  // Create comprehensive media stats
  const mediaStats = {
    total: allMediaFiles.length,
    totalFiles: allMediaFiles.length,
    totalSize: allMediaFiles.reduce((acc, file) => acc + (file.size || 0), 0),
    images: allMediaFiles.filter(file => file.file_type.startsWith('image/')).length,
    videos: allMediaFiles.filter(file => file.file_type.startsWith('video/')).length,
    documents: allMediaFiles.filter(file => file.file_type.includes('pdf') || file.file_type.includes('document')).length,
    filesByType: {
      image: allMediaFiles.filter(file => file.file_type.startsWith('image/')).length,
      video: allMediaFiles.filter(file => file.file_type.startsWith('video/')).length,
      pdf: allMediaFiles.filter(file => file.file_type.includes('pdf')).length,
      audio: allMediaFiles.filter(file => 
        file.file_type.startsWith('audio/') || 
        file.file_type.includes('audio/mpeg') || 
        file.file_type.includes('audio/mp3') || 
        file.file_type.includes('audio/x-m4a')
      ).length,
      application: allMediaFiles.filter(file => file.file_type.startsWith('application/') && !file.file_type.includes('pdf')).length,
    }
  };

  // Get unique media types and categories - properly typed
  const mediaTypes: MediaType[] = ['image', 'video', 'pdf', 'audio', 'document'];
  const categories = ['all', ...Array.from(new Set(allMediaFiles.map(file => file.category || 'general')))];

  // Filter media files based on search and filters
  useEffect(() => {
    let filtered = [...allMediaFiles];

    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedMediaType !== 'all') {
      filtered = filtered.filter(file => {
        if (selectedMediaType === 'image') return file.file_type.startsWith('image/');
        if (selectedMediaType === 'video') return file.file_type.startsWith('video/');
        if (selectedMediaType === 'pdf') return file.file_type.includes('pdf');
        if (selectedMediaType === 'audio') return file.file_type.startsWith('audio/') || file.file_type.includes('audio/mpeg') || file.file_type.includes('audio/mp3') || file.file_type.includes('audio/x-m4a');
        if (selectedMediaType === 'document') return file.file_type.includes('pdf') || file.file_type.includes('document');
        return true;
      });
    }

    setFilteredMediaFiles(filtered);
  }, [allMediaFiles, searchQuery, selectedMediaType, selectedCategory, dateFilter]);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  return {
    mediaFiles,
    allMediaFiles,
    filteredMediaFiles,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedMediaType,
    setSelectedMediaType,
    selectedCategory,
    setSelectedCategory,
    dateFilter,
    setDateFilter,
    mediaStats,
    mediaTypes,
    categories,
    fetchMediaFiles,
    fetchAllMedia,
    uploadMediaFile,
    deleteMediaFile,
    deleteMediaItem,
    updateMediaFile,
    useMediaInContext: () => {}, // Placeholder function
  };
}
