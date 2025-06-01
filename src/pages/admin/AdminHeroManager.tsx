
import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, Eye, GripVertical, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSimpleAuthContext } from "@/contexts/SimpleAuthContext";
import { PageLoader } from "@/components/ui/page-loader";

interface MediaImage {
  id: string;
  title: string;
  file_url: string;
  is_hero: boolean;
  hero_tag: string | null;
  display_order: number | null;
}

const HERO_TAG_OPTIONS = [
  { value: "main-hero", label: "Main Hero" },
  { value: "event-hero", label: "Event Hero" },
  { value: "audio-hero", label: "Audio Hero" },
  { value: "store-hero", label: "Store Hero" }
];

export default function AdminHeroManager() {
  const { user, profile, isAuthenticated, isLoading: authLoading, isAdmin } = useSimpleAuthContext();
  const [images, setImages] = useState<MediaImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<MediaImage[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [previewImages, setPreviewImages] = useState<MediaImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check if user has admin access
  const hasAdminAccess = isAdmin();

  // Show loading while auth is initializing
  if (authLoading) {
    return <PageLoader message="Verifying admin access..." className="min-h-screen" />;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load
  if (!profile) {
    return <PageLoader message="Loading user profile..." className="min-h-screen" />;
  }

  // Check admin access and redirect if not admin
  if (!hasAdminAccess) {
    toast.error("Access denied. Admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // Fetch all media images
  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('id, title, file_url, is_hero, hero_tag, display_order')
        .not('file_url', 'is', null)
        .order('display_order', { ascending: true });

      if (error) throw error;

      const formattedImages: MediaImage[] = data.map(item => ({
        id: item.id,
        title: item.title,
        file_url: item.file_url,
        is_hero: item.is_hero || false,
        hero_tag: item.hero_tag,
        display_order: item.display_order || 0
      }));

      setImages(formattedImages);
      setFilteredImages(formattedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter images based on selected filter
  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter(img => img.hero_tag === selectedFilter));
    }
  }, [images, selectedFilter]);

  // Update preview images when filter changes
  useEffect(() => {
    if (selectedFilter === "all") {
      setPreviewImages(images.filter(img => img.is_hero));
    } else {
      setPreviewImages(images.filter(img => img.is_hero && img.hero_tag === selectedFilter));
    }
  }, [images, selectedFilter]);

  useEffect(() => {
    fetchImages();
  }, []);

  // Update image data
  const updateImage = (id: string, field: keyof MediaImage, value: any) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, [field]: value } : img
    ));
    setHasChanges(true);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const newImages = Array.from(filteredImages);
    const [reorderedItem] = newImages.splice(sourceIndex, 1);
    newImages.splice(destinationIndex, 0, reorderedItem);

    // Update display_order for reordered items
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      display_order: index
    }));

    // Update the main images array
    setImages(prev => prev.map(img => {
      const updated = updatedImages.find(u => u.id === img.id);
      return updated || img;
    }));

    setHasChanges(true);
  };

  // Save all changes
  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const updates = images.map(img => ({
        id: img.id,
        is_hero: img.is_hero,
        hero_tag: img.hero_tag,
        display_order: img.display_order
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('media_library')
          .update({
            is_hero: update.is_hero,
            hero_tag: update.hero_tag,
            display_order: update.display_order
          })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast.success("Changes saved successfully");
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete image
  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== id));
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error("Failed to delete image");
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading hero images..." className="min-h-screen" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hero Image Manager</h1>
        <p className="text-muted-foreground">Manage which images appear in hero sections across the site</p>
      </div>

      {/* Filter and Preview Section */}
      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Filter & Preview
            </CardTitle>
            <CardDescription>
              Filter images by hero section and preview active hero images
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="filter">Filter by Hero Section</Label>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Images</SelectItem>
                  {HERO_TAG_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preview Carousel */}
            {previewImages.length > 0 && (
              <div>
                <Label className="mb-2 block">Active Hero Images Preview</Label>
                <Carousel className="w-full max-w-xs mx-auto">
                  <CarouselContent>
                    {previewImages
                      .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                      .map((image) => (
                        <CarouselItem key={image.id}>
                          <div className="aspect-video overflow-hidden rounded-md">
                            <img
                              src={image.file_url}
                              alt={image.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="p-2 bg-background/80 backdrop-blur-sm">
                              <p className="text-sm font-medium truncate">{image.title}</p>
                              <Badge variant="secondary" className="text-xs">
                                {HERO_TAG_OPTIONS.find(opt => opt.value === image.hero_tag)?.label}
                              </Badge>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Changes Button */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button 
            onClick={saveChanges} 
            disabled={isSaving}
            size="lg"
            className="shadow-lg"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}

      {/* Images Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid gap-4"
            >
              {filteredImages.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-shadow ${
                        snapshot.isDragging ? 'shadow-lg' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Drag Handle and Thumbnail */}
                          <div className="flex items-center gap-3">
                            <div 
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden bg-gray-100">
                              <img
                                src={image.file_url}
                                alt={image.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{image.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {image.file_url}
                              </p>
                            </div>
                          </div>

                          {/* Controls */}
                          <div className="flex flex-col md:flex-row gap-4 md:items-center">
                            {/* Is Hero Toggle */}
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={image.is_hero}
                                onCheckedChange={(checked) => 
                                  updateImage(image.id, 'is_hero', checked)
                                }
                              />
                              <Label className="text-sm">Hero Image</Label>
                            </div>

                            {/* Hero Tag Dropdown */}
                            <div className="min-w-[140px]">
                              <Select
                                value={image.hero_tag || ""}
                                onValueChange={(value) => 
                                  updateImage(image.id, 'hero_tag', value)
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Select tag" />
                                </SelectTrigger>
                                <SelectContent>
                                  {HERO_TAG_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Display Order */}
                            <div className="w-20">
                              <Input
                                type="number"
                                placeholder="Order"
                                value={image.display_order || 0}
                                onChange={(e) => 
                                  updateImage(image.id, 'display_order', parseInt(e.target.value) || 0)
                                }
                                className="h-8"
                              />
                            </div>

                            {/* Delete Button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{image.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteImage(image.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No images found for the selected filter.</p>
        </div>
      )}
    </div>
  );
}
