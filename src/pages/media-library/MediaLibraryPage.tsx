import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FilesIcon, Upload, Search, Filter, Calendar, List, Grid2X2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MediaFile, MediaStats } from "@/types/media";
import { MediaType, getMediaType, getMediaTypeLabel } from "@/utils/mediaUtils";
import { MediaFilesSection } from "@/components/media/MediaFilesSection";
import { useAudioFiles } from "@/hooks/useAudioFiles";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function MediaLibraryPage() {
  const { audioFiles, loading: audioLoading } = useAudioFiles();
  const { user } = useAuth();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const isMobile = useIsMobile();
  
  // Check if user has permission to upload files
  const canUploadMedia = isSuperAdmin || hasPermission('can_upload_media');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [allMediaFiles, setAllMediaFiles] = useState<MediaFile[]>([]);
  const [filteredMediaFiles, setFilteredMediaFiles] = useState<MediaFile[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState<MediaType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [dateFilter, setDateFilter] = useState<"newest" | "oldest">("newest");
  
  // Fetch all media files with RLS automatically handling permission
  const fetchAllMedia = async () => {
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
      const typedStorageFiles = storageFiles?.map(file => ({
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
        size: file.size || 0 // Default to 0 if size is not available
      })) || [];
      
      const combinedFiles = [
        ...typedStorageFiles,
        ...audioMediaFiles
      ];
      
      console.log("Combined total files:", combinedFiles.length);
      setAllMediaFiles(combinedFiles);
      
      // Calculate statistics
      const stats: MediaStats = {
        totalFiles: combinedFiles.length,
        totalSize: combinedFiles.reduce((total, file) => total + file.size, 0),
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
  };
  
  // Apply filters to media files
  const applyFilters = (
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
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(allMediaFiles, query, selectedMediaType, selectedCategory);
  };
  
  // Handle media type filter change
  const handleMediaTypeChange = (value: string) => {
    setSelectedMediaType(value as MediaType | "all");
    applyFilters(allMediaFiles, searchQuery, value as MediaType | "all", selectedCategory);
  };
  
  // Handle category filter change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    applyFilters(allMediaFiles, searchQuery, selectedMediaType, value);
  };
  
  // Handle date filter change
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value as "newest" | "oldest");
    // Re-fetch with new sorting
    fetchAllMedia();
  };
  
  useEffect(() => {
    console.log("MediaLibraryPage: Initial render, fetching data");
    fetchAllMedia();
  }, [audioFiles, dateFilter]); // Refetch when audio files or date filter change
  
  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data");
    fetchAllMedia();
  };

  // Get all media types we have files for
  const mediaTypes: MediaType[] = ["pdf", "audio", "image", "video", "other"];
  
  // Get unique categories from files
  const categories = Array.from(
    new Set(allMediaFiles.map(file => file.category).filter(Boolean))
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FilesIcon className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to load media library</h2>
        <p className="text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={() => fetchAllMedia()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Media Library"
        description="Access and manage all your media files in one place"
        icon={<FilesIcon className="h-6 w-6" />}
      />
      
      {/* Stats Row */}
      {mediaStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Files</h3>
            <p className="text-2xl font-bold">{mediaStats.totalFiles}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="text-sm font-medium text-muted-foreground">Total Size</h3>
            <p className="text-2xl font-bold">{formatFileSize(mediaStats.totalSize)}</p>
          </div>
          <div className="bg-card rounded-lg p-4 border col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Files by Type</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(mediaStats.filesByType).map(([type, count]) => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {getMediaTypeLabel(type as MediaType)}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Button - Prominently displayed at the top */}
      {canUploadMedia && (
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2"
            size={isMobile ? "default" : "lg"}
          >
            <Upload className={`${isMobile ? "h-4 w-4" : "h-5 w-5"}`} /> 
            {isMobile ? "Upload" : "Upload Media File"}
          </Button>
        </div>
      )}
      
      {/* Search and Filter Bar - Responsive layout */}
      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <div className="md:col-span-3">
            <Select
              value={selectedMediaType}
              onValueChange={handleMediaTypeChange}
            >
              <SelectTrigger className="w-full">
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
          </div>
          
          <div className="md:col-span-3">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3">
            <Select
              value={dateFilter}
              onValueChange={handleDateFilterChange}
            >
              <SelectTrigger className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3 flex justify-end">
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid2X2 className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid view</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List view</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Loading media library...</p>
        </div>
      ) : (
        <>
          {filteredMediaFiles.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No media files found matching your criteria.</p>
              {canUploadMedia && (
                <Button 
                  onClick={() => setIsUploadModalOpen(true)}
                  variant="outline" 
                  className="mt-4"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Your First Media File
                </Button>
              )}
            </div>
          ) : (
            <>
              {selectedMediaType === "all" && selectedCategory === "all" ? (
                // When showing all types, use accordion for better organization
                <Accordion type="single" collapsible className="w-full" defaultValue="sheet_music">
                  {mediaTypes.map((mediaType) => {
                    const filesOfType = filteredMediaFiles.filter(
                      file => getMediaType(file.file_type) === mediaType
                    );
                    
                    if (filesOfType.length === 0) return null;
                    
                    return (
                      <AccordionItem key={mediaType} value={mediaType}>
                        <AccordionTrigger className="text-lg">
                          {getMediaTypeLabel(mediaType)} ({filesOfType.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <MediaFilesSection
                            files={filesOfType}
                            mediaType={mediaType}
                            viewMode={viewMode}
                            onDelete={fetchAllMedia}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                // When filtered, show all matching files
                <MediaFilesSection
                  files={filteredMediaFiles}
                  mediaType={selectedMediaType as MediaType}
                  viewMode={viewMode}
                  onDelete={fetchAllMedia}
                  title={selectedCategory !== "all" ? `${selectedCategory.replace('_', ' ')}` : undefined}
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
        defaultCategory={selectedCategory !== "all" ? selectedCategory : "general"}
      />
    </div>
  );
}
