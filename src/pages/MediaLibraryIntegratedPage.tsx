
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { LibraryIcon, ImageIcon, FileTextIcon, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { hasPermission } from "@/utils/permissionChecker";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { MediaGridView } from "@/components/media/MediaGridView";
import { MediaListView } from "@/components/media/MediaListView";
import { MediaLoadingState } from "@/components/media/MediaLoadingState";
import { MediaFilterBar } from "@/components/media/MediaFilterBar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MediaLibraryIntegratedPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { hasPermission: legacyHasPermission } = usePermissions();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [targetSection, setTargetSection] = useState<string | null>(null);
  
  // Create user object for permission checking
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  // Check permissions - use new permission system
  const canUpload = !!user && hasPermission(currentUser, 'upload_media');
  const canEdit = legacyHasPermission('can_edit_media');
  const canDelete = legacyHasPermission('can_delete_media');
  const canEditSite = legacyHasPermission('can_edit_site');
  
  const {
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
    mediaTypes,
    categories,
    fetchAllMedia,
    deleteMediaItem,
    useMediaInContext
  } = useMediaLibrary();

  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data");
    fetchAllMedia();
    setIsUploadModalOpen(false);
  };

  const handleUseInHero = async (mediaId: string) => {
    // Find the media file
    const mediaFile = filteredMediaFiles.find(file => file.id === mediaId);
    if (!mediaFile) return;
    
    try {
      // Create site_image with this media
      const { error } = await supabase.from('site_images').insert({
        name: mediaFile.title,
        description: mediaFile.description || 'Added from media library',
        file_path: mediaFile.file_path,
        file_url: mediaFile.file_url,
        category: 'hero'
      });
      
      if (error) throw error;
      
      toast.success("Image added to hero section", {
        description: "The image will now appear in the hero slideshow"
      });
      
    } catch (err) {
      console.error("Error adding to hero:", err);
      toast.error("Failed to add image to hero section");
    }
  };

  const handleUseInPressKit = async (mediaId: string) => {
    // Find the media file
    const mediaFile = filteredMediaFiles.find(file => file.id === mediaId);
    if (!mediaFile) return;
    
    try {
      // Create site_image with this media
      const { error } = await supabase.from('site_images').insert({
        name: mediaFile.title,
        description: mediaFile.description || 'Added from media library',
        file_path: mediaFile.file_path,
        file_url: mediaFile.file_url,
        category: 'press-kit'
      });
      
      if (error) throw error;
      
      toast.success("Image added to press kit", {
        description: "The image will now appear in the press kit gallery"
      });
      
    } catch (err) {
      console.error("Error adding to press kit:", err);
      toast.error("Failed to add image to press kit");
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <LibraryIcon className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold mb-2">Unable to load media library</h2>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button onClick={() => fetchAllMedia()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Media Library"
        description="Manage and use media across the site"
        icon={<LibraryIcon className="h-6 w-6" />}
      />
      
      <div className="mt-6 space-y-6">
        {/* Upload and view controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {canUpload && (
            <Button 
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-glee-purple hover:bg-glee-purple/90"
            >
              Upload New Media
            </Button>
          )}
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              onClick={() => setViewMode("grid")}
              size="icon"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "default" : "outline"} 
              onClick={() => setViewMode("list")}
              size="icon"
            >
              <FileTextIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Filter bar */}
        <MediaFilterBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedMediaType={selectedMediaType}
          setSelectedMediaType={setSelectedMediaType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          dateFilter={dateFilter as "newest" | "oldest"}
          setDateFilter={setDateFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
          mediaTypes={mediaTypes as any[]}
          categories={categories}
        />

        {/* Site Integration Section */}
        {canUpload && canEditSite && (
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-2">Site Integration</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Select media files below and use them in different sections of the website.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTargetSection("hero")}
              >
                Use in Hero Section
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTargetSection("press-kit")}
              >
                Use in Press Kit
              </Button>
            </div>
            
            {targetSection && (
              <div className="mt-3 p-3 bg-muted/30 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">
                    Select an image to use in the {targetSection === "hero" ? "hero section" : "press kit"}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setTargetSection(null)}
                  >
                    Cancel
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground mb-1">
                  Click on an image below to add it to the {targetSection === "hero" ? "hero slideshow" : "press kit gallery"}
                </p>
              </div>
            )}
          </Card>
        )}
        
        <Separator />
        
        {/* Loading State */}
        <MediaLoadingState 
          isLoading={isLoading}
          isEmpty={filteredMediaFiles.length === 0}
          canUpload={canUpload}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
        
        {!isLoading && filteredMediaFiles.length > 0 && (
          <div>
            {viewMode === "grid" ? (
              <MediaGridView 
                mediaFiles={filteredMediaFiles}
                canEdit={canEdit}
                canDelete={canDelete}
                onDelete={(id) => {
                  deleteMediaItem(id);
                  return Promise.resolve();
                }}
              />
            ) : (
              <MediaListView 
                mediaFiles={filteredMediaFiles}
                canEdit={canEdit}
                canDelete={canDelete}
                onDelete={(id) => {
                  deleteMediaItem(id);
                  return Promise.resolve();
                }}
              />
            )}
          </div>
        )}
      </div>
      
      {/* Upload Modal */}
      {canUpload && (
        <UploadMediaModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default MediaLibraryIntegratedPage;
