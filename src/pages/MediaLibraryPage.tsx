
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Library, FileText, Image, Music, Video, Search, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { getMediaType, getMediaTypeLabel } from "@/utils/mediaUtils";
import { PDFThumbnail } from "@/components/pdf/PDFThumbnail";
import { formatFileSize } from "@/utils/file-utils";
import { MediaType } from "@/utils/mediaUtils";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { useAuth } from "@/contexts/AuthContext";

interface MediaLibraryPageProps {
  isAdminView?: boolean;
}

const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({ isAdminView = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isLoading,
    error,
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
    fetchAllMedia,
  } = useMediaLibrary();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<MediaType | "all">("all");
  
  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Calculate counts for each media type from all files (not filtered)
  const mediaCounts = {
    all: allMediaFiles.length,
    pdf: allMediaFiles.filter(file => {
      const mediaType = getMediaType(file.file_type);
      console.log('PDF Filter Debug:', { fileName: file.title, fileType: file.file_type, detectedType: mediaType });
      return mediaType === "pdf";
    }).length,
    image: allMediaFiles.filter(file => getMediaType(file.file_type) === "image").length,
    audio: allMediaFiles.filter(file => getMediaType(file.file_type) === "audio").length,
    video: allMediaFiles.filter(file => getMediaType(file.file_type) === "video").length,
  };
  
  // Update state when mediaType is changed
  useEffect(() => {
    console.log('Setting selected media type to:', activeTab);
    setSelectedMediaType(activeTab);
  }, [activeTab, setSelectedMediaType]);
  
  const handleFileOpen = (file: any) => {
    console.log('Opening file:', { id: file.id, type: file.file_type, url: file.file_url, title: file.title });
    
    const mediaType = getMediaType(file.file_type);
    
    switch (mediaType) {
      case "pdf":
        // Navigate to the sheet music viewer for PDFs
        navigate(`/dashboard/sheet-music/view/${file.id}`, { 
          state: { 
            file: {
              id: file.id,
              title: file.title,
              url: file.file_url,
              file_url: file.file_url,
              sheetMusicId: file.id
            },
            fromMediaLibrary: true
          } 
        });
        break;
        
      case "image":
      case "video":
      case "audio":
        // Open media files directly in a new tab
        window.open(file.file_url, '_blank');
        break;
        
      default:
        // For other file types, try to open in new tab or show message
        if (file.file_url) {
          window.open(file.file_url, '_blank');
        } else {
          toast.error("Unable to open file", {
            description: "This file type is not supported for preview"
          });
        }
        break;
    }
  };

  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing media files");
    fetchAllMedia();
    setIsUploadModalOpen(false);
  };

  // Filter files based on active tab
  const getFilesForTab = (tabType: MediaType | "all") => {
    if (tabType === "all") {
      return filteredMediaFiles;
    }
    
    const filtered = filteredMediaFiles.filter(file => {
      const mediaType = getMediaType(file.file_type);
      console.log('Tab Filter Debug:', { 
        tabType, 
        fileName: file.title, 
        fileType: file.file_type, 
        detectedType: mediaType,
        matches: mediaType === tabType 
      });
      return mediaType === tabType;
    });
    
    console.log(`Files for tab ${tabType}:`, filtered.length);
    return filtered;
  };

  // Sort files by title for better organization
  const sortFilesByTitle = (files: any[]) => {
    return [...files].sort((a, b) => {
      return a.title.localeCompare(b.title, undefined, { 
        numeric: true, 
        sensitivity: 'base' 
      });
    });
  };

  // Debug log for media counts
  console.log('Media counts:', mediaCounts);
  console.log('All media files:', allMediaFiles.length);
  console.log('Filtered media files:', filteredMediaFiles.length);

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Media Library"
        description="Access and manage all your media files including sheet music, images, audio recordings, and videos"
        icon={<Library className="h-6 w-6" />}
        actions={
          <div className="flex items-center gap-2">
            {isAdminView && user && (
              <Button 
                className="bg-glee-purple hover:bg-glee-purple/90"
                onClick={() => setIsUploadModalOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Media
              </Button>
            )}
          </div>
        }
      />
      
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> 
            Filter
          </Button>
        </div>
      </div>
      
      {/* Media type tabs with fixed counts */}
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => {
          console.log('Tab changed to:', value);
          setActiveTab(value as MediaType | "all");
        }}
        className="w-full mb-6"
      >
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Library className="h-4 w-4" /> All ({mediaCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Documents ({mediaCounts.pdf})
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <Music className="h-4 w-4" /> Audio ({mediaCounts.audio})
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <Image className="h-4 w-4" /> Images ({mediaCounts.image})
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-1">
            <Video className="h-4 w-4" /> Video ({mediaCounts.video})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="w-full">
          <MediaGrid files={sortFilesByTitle(getFilesForTab("all"))} onFileOpen={handleFileOpen} />
        </TabsContent>
        
        <TabsContent value="pdf" className="w-full">
          <MediaGrid 
            files={sortFilesByTitle(getFilesForTab("pdf"))}
            onFileOpen={handleFileOpen}
            showPDFCount={true}
          />
        </TabsContent>
        
        <TabsContent value="audio" className="w-full">
          <MediaGrid 
            files={sortFilesByTitle(getFilesForTab("audio"))}
            onFileOpen={handleFileOpen}
          />
        </TabsContent>
        
        <TabsContent value="image" className="w-full">
          <MediaGrid 
            files={sortFilesByTitle(getFilesForTab("image"))}
            onFileOpen={handleFileOpen}
          />
        </TabsContent>
        
        <TabsContent value="video" className="w-full">
          <MediaGrid 
            files={sortFilesByTitle(getFilesForTab("video"))}
            onFileOpen={handleFileOpen}
          />
        </TabsContent>
      </Tabs>

      {/* Upload Media Modal */}
      {isAdminView && user && (
        <UploadMediaModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

// Media grid component to display files
interface MediaGridProps {
  files: any[];
  onFileOpen: (file: any) => void;
  showPDFCount?: boolean;
}

const MediaGrid: React.FC<MediaGridProps> = ({ files, onFileOpen, showPDFCount = false }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <Library className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No media files found</h3>
        <p className="text-muted-foreground">
          {showPDFCount ? "No PDF documents available. Try uploading some PDF files." : "Try changing your search or filter settings"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {showPDFCount && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {files.length} document{files.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {files.map((file) => {
          const mediaType = getMediaType(file.file_type);
          
          return (
            <Card key={file.id} className="overflow-hidden h-full flex flex-col">
              <div className="relative aspect-video bg-muted flex items-center justify-center">
                {mediaType === "pdf" ? (
                  <div className="w-full h-full bg-white relative overflow-hidden border rounded-t-lg">
                    <PDFThumbnail
                      url={file.file_url}
                      title={file.title}
                      className="w-full h-full"
                      aspectRatio={16/9}
                    />
                  </div>
                ) : mediaType === "image" ? (
                  <div className="w-full h-full relative">
                    <img 
                      src={file.file_url} 
                      alt={file.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image failed to load:', file.file_url);
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <svg class="h-16 w-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                ) : mediaType === "audio" ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music className="h-16 w-16 text-muted-foreground" />
                  </div>
                ) : mediaType === "video" ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="h-16 w-16 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="font-medium line-clamp-2 mb-2">{file.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1 flex-1">
                  {file.description || getMediaTypeLabel(mediaType)}
                </p>
                <div className="mt-auto pt-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <span>{mediaType.toUpperCase()}</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => onFileOpen(file)}
                  >
                    {mediaType === "pdf" ? (
                      <>
                        <FileText className="mr-2 h-4 w-4" /> View Document
                      </>
                    ) : mediaType === "image" ? (
                      <>
                        <Image className="mr-2 h-4 w-4" /> View Image
                      </>
                    ) : mediaType === "video" ? (
                      <>
                        <Video className="mr-2 h-4 w-4" /> Play Video
                      </>
                    ) : mediaType === "audio" ? (
                      <>
                        <Music className="mr-2 h-4 w-4" /> Play Audio
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" /> Open File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MediaLibraryPage;
