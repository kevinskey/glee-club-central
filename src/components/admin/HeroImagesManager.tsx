
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Plus, ArrowUp, ArrowDown, Image, Upload, Loader2 } from "lucide-react";
import { useSiteImageManager } from "@/hooks/useSiteImageManager";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { SiteImage } from "@/utils/siteImages";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function HeroImagesManager() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const {
    images,
    isLoading,
    hasChanges,
    fetchImages,
    addImage,
    removeImage,
    reorderImages,
    saveImageOrder
  } = useSiteImageManager("hero");
  
  // Load hero images on component mount
  useEffect(() => {
    fetchImages();
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Auto-fill name from filename (without extension)
      const fileName = file.name.split('.')[0];
      setImageName(fileName);
    }
  };
  
  const handleAddImage = async () => {
    if (!imageFile || !imageName) {
      return;
    }
    
    setIsUploading(true);
    try {
      const success = await addImage(imageFile, imageName, imageDescription);
      if (success) {
        resetForm();
        setIsAddDialogOpen(false);
      }
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setImageFile(null);
    setImageName("");
    setImageDescription("");
    setImagePreview(null);
  };
  
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
  
  const handleDialogClose = () => {
    resetForm();
    setIsAddDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Hero Images</CardTitle>
        <CardDescription>
          Add, remove, or reorder the images displayed in the hero section on the landing page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Hero Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Hero Image</DialogTitle>
                <DialogDescription>
                  Upload an image for the hero slideshow. Recommended size: 1920×1080px.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="imageFile">Upload Image</label>
                  <Input 
                    id="imageFile" 
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {imagePreview && (
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </AspectRatio>
                    </div>
                  )}
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="imageName">Image Name</label>
                  <Input 
                    id="imageName" 
                    placeholder="Hero Image Title"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="imageDescription">Description (optional)</label>
                  <Textarea 
                    id="imageDescription" 
                    placeholder="Describe this image..." 
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose}>Cancel</Button>
                <Button 
                  onClick={handleAddImage} 
                  disabled={isUploading || !imageFile || !imageName}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-md">
              <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">No hero images</h3>
              <p className="text-muted-foreground mb-4">Upload images to display in the hero slideshow.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add First Image
              </Button>
            </div>
          ) : (
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
                        {index + 1} of {images.length}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={fetchImages}
          disabled={isLoading || !hasChanges}
        >
          Reset Changes
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Order'
          )}
        </Button>
      </CardFooter>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Hero Image</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The image will be permanently removed from the hero slideshow.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteImage} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
