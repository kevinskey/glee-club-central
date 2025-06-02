
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, ArrowUp, ArrowDown, Images, Loader2, Plus, Upload, Eye } from "lucide-react";
import { useSiteImageManager } from "@/hooks/useSiteImageManager";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function EnhancedHeroImagesManager() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectImageDialogOpen, setSelectImageDialogOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  
  const {
    images,
    isLoading,
    hasChanges,
    fetchImages,
    removeImage,
    reorderImages,
    saveImageOrder
  } = useSiteImageManager("hero");

  const { filteredMediaFiles, fetchAllMedia } = useMediaLibrary();
  
  // Load hero images on component mount
  useEffect(() => {
    fetchImages();
    fetchAllMedia();
  }, []);
  
  const confirmDeleteImage = (id: string) => {
    setSelectedImage(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteImage = async () => {
    if (!selectedImage) return;
    
    await removeImage(selectedImage);
    setDeleteDialogOpen(false);
    setSelectedImage(null);
  };
  
  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === images.length - 1)
    ) {
      return;
    }
    
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap the images
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    reorderImages(newImages);
  };
  
  const handleSaveChanges = async () => {
    await saveImageOrder(images);
  };

  const handleSelectImageFromLibrary = async (mediaFile: any) => {
    try {
      // Add the selected media file to site_images as a hero image
      const { error } = await supabase.from('site_images').insert({
        name: mediaFile.title,
        description: mediaFile.description || 'Added from media library',
        file_path: mediaFile.file_path,
        file_url: mediaFile.file_url,
        category: 'hero',
        position: images.length // Add at the end
      });
      
      if (error) throw error;
      
      toast.success("Image added to hero section");
      setSelectImageDialogOpen(false);
      await fetchImages(); // Refresh the hero images list
    } catch (error) {
      console.error("Error adding image to hero:", error);
      toast.error("Failed to add image to hero section");
    }
  };

  const handlePreviewImage = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
  };

  const imageLibrary = filteredMediaFiles.filter(file => file.file_type?.startsWith('image/'));

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Hero Images Manager
            {images.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {images.length} image{images.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Manage which images are displayed in the hero section slideshow. Images will rotate automatically on the homepage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <Dialog open={selectImageDialogOpen} onOpenChange={setSelectImageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-glee-purple hover:bg-glee-purple/90">
                  <Plus className="mr-2 h-4 w-4" /> Add Image to Hero
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Select Image for Hero Section</DialogTitle>
                  <DialogDescription>
                    Choose an image from your media library to add to the hero slideshow.
                  </DialogDescription>
                </DialogHeader>
                <div className="max-h-96 overflow-y-auto">
                  {imageLibrary.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                      {imageLibrary.map((mediaFile) => (
                        <div
                          key={mediaFile.id}
                          className="relative cursor-pointer border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all duration-200"
                          onClick={() => handleSelectImageFromLibrary(mediaFile)}
                        >
                          <AspectRatio ratio={16/9}>
                            <img
                              src={mediaFile.file_url}
                              alt={mediaFile.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Image+Not+Found";
                              }}
                            />
                          </AspectRatio>
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <Plus className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="p-2 bg-background/95 backdrop-blur">
                            <p className="text-sm font-medium truncate">{mediaFile.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No images found in media library</p>
                      <p className="text-sm">Upload some images to the media library first</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {hasChanges && (
              <Button onClick={handleSaveChanges} disabled={isLoading} variant="outline">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Order Changes'
                )}
              </Button>
            )}
          </div>

          <Separator className="mb-6" />

          <div className="relative">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading hero images...</span>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <Images className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-xl mb-2">No hero images configured</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add images from your media library to create a beautiful hero slideshow for your homepage.
                </p>
                <Button onClick={() => setSelectImageDialogOpen(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" /> Add Your First Hero Image
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">
                    Current Hero Images ({images.length})
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Images will display in this order on the homepage
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <Card key={image.id} className="group overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={image.file_url}
                            alt={`Hero image ${index + 1}`}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Image+Not+Found";
                            }}
                          />
                        </AspectRatio>
                        
                        {/* Image controls overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200">
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 bg-white/90 hover:bg-white" 
                              onClick={() => handlePreviewImage(image.file_url)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => confirmDeleteImage(image.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 bg-white/90 hover:bg-white" 
                              onClick={() => handleMoveImage(index, 'up')}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 bg-white/90 hover:bg-white" 
                              onClick={() => handleMoveImage(index, 'down')}
                              disabled={index === images.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Position indicator */}
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="bg-black/70 text-white border-0">
                            #{index + 1}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <h5 className="font-medium truncate">{image.name}</h5>
                        {image.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {image.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Hero Image</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the image from the hero slideshow. The image will remain in your media library and can be re-added later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteImage} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove from Hero
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image preview dialog */}
      <Dialog open={!!previewImageUrl} onOpenChange={() => setPreviewImageUrl(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Hero Image Preview</DialogTitle>
          </DialogHeader>
          {previewImageUrl && (
            <div className="aspect-video overflow-hidden rounded-lg border">
              <img
                src={previewImageUrl}
                alt="Hero image preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
