
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Library, FileText, Image, Music, Video, Search, Filter, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { getMediaType, getMediaTypeLabel } from "@/utils/mediaUtils";
import { PDFPreview } from "@/components/pdf/PDFPreview";
import { formatFileSize } from "@/utils/file-utils";
import { MediaType } from "@/utils/mediaUtils";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const MediaLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    error,
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
  } = useMediaLibrary();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<MediaType | "all">("all");
  
  // Update state when mediaType is changed
  useEffect(() => {
    setSelectedMediaType(activeTab);
  }, [activeTab, setSelectedMediaType]);
  
  const handleViewPDF = (fileId: string, fileUrl: string, title: string) => {
    navigate(`/dashboard/media/pdf/${fileId}`, { 
      state: { url: fileUrl, title } 
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Media Library"
        description="Manage your media files for sheet music, audio, images, and videos"
        icon={<Library className="h-6 w-6" />}
        actions={
          <Button className="bg-glee-purple hover:bg-glee-purple/90">
            <Upload className="mr-2 h-4 w-4" /> Upload Media
          </Button>
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
      
      {/* Media type tabs */}
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as MediaType | "all")}
        className="w-full mb-6"
      >
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Library className="h-4 w-4" /> All
          </TabsTrigger>
          <TabsTrigger value="pdf" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-1">
            <Music className="h-4 w-4" /> Audio
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-1">
            <Image className="h-4 w-4" /> Images
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-1">
            <Video className="h-4 w-4" /> Video
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="w-full">
          <MediaGrid files={filteredMediaFiles} onViewPDF={handleViewPDF} />
        </TabsContent>
        
        {["pdf", "audio", "image", "video"].map((type) => (
          <TabsContent key={type} value={type} className="w-full">
            <MediaGrid 
              files={filteredMediaFiles}
              onViewPDF={handleViewPDF}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Media grid component to display files
interface MediaGridProps {
  files: any[];
  onViewPDF: (id: string, url: string, title: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ files, onViewPDF }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <Library className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No media files found</h3>
        <p className="text-muted-foreground">Try changing your search or filter settings</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {files.map((file) => {
        const mediaType = getMediaType(file.file_type);
        
        return (
          <Card key={file.id} className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-video bg-muted flex items-center justify-center">
              {mediaType === "pdf" && (
                <PDFPreview
                  url={file.file_url}
                  title={file.title}
                  className="w-full h-full cursor-pointer"
                  previewWidth={300}
                  previewHeight={200}
                  mediaSourceId={file.id}
                  category={file.category || "General"}
                >
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </PDFPreview>
              )}
              {mediaType === "image" && (
                <img 
                  src={file.file_url} 
                  alt={file.title}
                  className="w-full h-full object-cover"
                />
              )}
              {mediaType === "audio" && (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              {mediaType === "video" && (
                <div className="w-full h-full flex items-center justify-center">
                  <Video className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              {mediaType === "other" && (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <h3 className="font-medium line-clamp-1">{file.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {file.description || getMediaTypeLabel(mediaType)}
              </p>
              <div className="mt-auto pt-4">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{mediaType.toUpperCase()}</span>
                  <span>{formatFileSize(file.size || 0)}</span>
                </div>
                {mediaType === "pdf" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => onViewPDF(file.id, file.file_url, file.title)}
                  >
                    <FileText className="mr-2 h-4 w-4" /> View PDF
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default MediaLibraryPage;
