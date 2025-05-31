
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, ArrowUp, ArrowDown, Image, Loader2, Plus } from "lucide-react";
import { useSiteImageManager } from "@/hooks/useSiteImageManager";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function HeroImagesManager() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectImageDialogOpen, setSelectImageDialogOpen] = useState(false);
  
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hero Images Manager</CardTitle>
        <CardDescription>
          Manage which images are displayed in the hero section slideshow. Current hero images are shown below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex justify-between items-center">
          <Dialog open={selectImageDialogOpen} onOpenChange={setSelectImageDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Image to Hero
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Select Image for Hero Section</DialogTitle>
                <DialogDescription>
                  Choose an image from your media library to add to the hero slideshow.
                </DialogDescription>
              </DialogHeader>
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {filteredMediaFiles
                    .filter(file => file.file_type?.startsWith('image/'))
                    .map((mediaFile) => (
                    <div
                      key={mediaFile.id}
                      className="relative cursor-pointer border rounded-lg overflow-hidden hover:border-primary transition-colors"
                      onClick={() => handleSelectImageFromLibrary(mediaFile)}
                    >
                      <AspectRatio ratio={16/9}>
                        <img
                          src={mediaFile.file_url}
                          alt={mediaFile.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Image+Not+Found";
                          }}
                        />
                      </AspectRatio>
                      <div className="p-2 bg-background/90">
                        <p className="text-sm font-medium truncate">{mediaFile.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredMediaFiles.filter(file => file.file_type?.startsWith('image/')).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No images found in media library</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {hasChanges && (
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          )}
        </div>

        <div className="relative mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-md">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No hero images configured</h3>
              <p className="text-muted-foreground mb-4">Add images from your media library to display in the hero slideshow.</p>
              <Button onClick={() => setSelectImageDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add First Image
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Current Hero Images ({images.length})
                </h4>
                <p className="text-xs text-muted-foreground">
                  These images will rotate in the hero section. Use the arrows to reorder them.
                </p>
              </div>
              
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="relative group">
                        <div className="aspect-video overflow-hidden rounded-md border border-border">
                          <img
                            src={image.file_url}
                            alt={`Hero image ${index + 1}`}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Image+Not+Found";
                            }}
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => confirmDeleteImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleMoveImage(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="h-8 w-8" 
                            onClick={() => handleMoveImage(index, 'down')}
                            disabled={index === images.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded text-xs">
                          <p className="font-medium">{image.name}</p>
                          <p className="text-muted-foreground">{index + 1} of {images.length}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </>
          )}
        </div>
      </CardContent>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Hero Image</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the image from the hero slideshow. The image will remain in your media library.
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
    </Card>
  );
}
