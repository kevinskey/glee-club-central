
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilesIcon, Upload, Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile } from "@/types/media";
import { MediaType, getMediaType, getMediaTypeLabel } from "@/utils/mediaUtils";
import { MediaFilesSection } from "@/components/media/MediaFilesSection";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const { audioFiles } = useAudioFiles();
  const { user, profile } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "all">("all");
  const [dateFilter, setDateFilter] = useState<"newest" | "oldest">("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const isAdmin = profile?.role === "admin";
  
  // Fetch all media files with RLS automatically handling permission
  const fetchAllMedia = async () => {
    setIsLoading(true);
    try {
      // Fetch files from storage - fixed table name from "media_files" to "media_library"
      const { data: storageFiles, error: storageError } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: dateFilter === "oldest" });
      
      if (storageError) throw storageError;
      
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
          uploaded_by: audioFile.uploaded_by
        }));
      
      // Combine all media files, ensuring proper type casting for storageFiles
      const typedStorageFiles = storageFiles?.map(file => ({
        id: file.id,
        title: file.title,
        description: file.description,
        file_url: file.file_url,
        file_path: file.file_path,
        file_type: file.file_type,
        created_at: file.created_at,
        uploaded_by: file.uploaded_by
      })) || [];
      
      const combinedFiles = [
        ...typedStorageFiles,
        ...audioMediaFiles
      ];
      
      setAllMediaFiles(combinedFiles);
      applyFilters(combinedFiles, searchQuery, selectedMediaType);
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
  
  // Apply filters to media files
  const applyFilters = (
    files: MediaFile[], 
    query: string, 
    mediaTypeFilter: MediaType | "all"
  ) => {
    let filtered = [...files];
    
    // Apply search query filter
    if (query.trim() !== "") {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(file => 
        file.title.toLowerCase().includes(lowerQuery) || 
        (file.description && file.description.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Apply media type filter
    if (mediaTypeFilter !== "all") {
      filtered = filtered.filter(file => getMediaType(file.file_type) === mediaTypeFilter);
    }
    
    setFilteredMediaFiles(filtered);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(allMediaFiles, query, selectedMediaType);
  };
  
  // Handle media type filter change
  const handleMediaTypeChange = (value: MediaType | "all") => {
    setSelectedMediaType(value);
    applyFilters(allMediaFiles, searchQuery, value);
  };
  
  // Handle date filter change
  const handleDateFilterChange = (value: "newest" | "oldest") => {
    setDateFilter(value);
    // Re-fetch with new sorting
    fetchAllMedia();
  };
  
  useEffect(() => {
    fetchAllMedia();
  }, [audioFiles, dateFilter]); // Refetch when audio files or date filter change
  
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
          isAdmin ? (
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" /> Upload Media
            </Button>
          ) : null
        }
      />
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={selectedMediaType}
            onValueChange={(value) => handleMediaTypeChange(value as MediaType | "all")}
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {mediaTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getMediaTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={dateFilter}
            onValueChange={(value) => handleDateFilterChange(value as "newest" | "oldest")}
          >
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          {filteredMediaFiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No media files found matching your criteria.
            </div>
          ) : (
            <>
              {selectedMediaType === "all" ? (
                // When showing all types, group by media type
                mediaTypes.map((mediaType) => {
                  const filesOfType = filteredMediaFiles.filter(
                    file => getMediaType(file.file_type) === mediaType
                  );
                  
                  if (filesOfType.length === 0) return null;
                  
                  return (
                    <React.Fragment key={mediaType}>
                      <MediaFilesSection
                        files={filesOfType}
                        mediaType={mediaType}
                        title={getMediaTypeLabel(mediaType)}
                      />
                      <Separator className="my-8" />
                    </React.Fragment>
                  );
                })
              ) : (
                // When filtered to a specific type, show all files of that type
                <MediaFilesSection
                  files={filteredMediaFiles}
                  mediaType={selectedMediaType}
                  title={getMediaTypeLabel(selectedMediaType)}
                />
              )}
            </>
          )}
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
