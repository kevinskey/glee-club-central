
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { X, Plus, ArrowUp, ArrowDown, Image } from "lucide-react";

// In a real application, these would be loaded and saved to a database
const initialHeroImages = [
  "/lovable-uploads/a2e734d0-cb83-4b32-be93-9f3f0da03fc4.png",
  "/lovable-uploads/e06ff100-0add-4adc-834f-50ef81098d35.png",
  "/lovable-uploads/8aa13e63-fb9a-4c52-95cf-86b458c58f1c.png",
  "/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png",
  "/lovable-uploads/642b93d7-fc15-4c2c-a7df-fe81aadb2f3b.png",
  "/lovable-uploads/4df78d4e-3a15-4e50-9326-6f47a48e2bab.png",
  "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1920&q=80"
];

export function HeroImagesManager() {
  const [images, setImages] = useState<string[]>(initialHeroImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    setImages([...images, newImageUrl]);
    setNewImageUrl("");
    setImageDescription("");
    setIsAddDialogOpen(false);
    setHasChanges(true);
    toast.success("Image added successfully");
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    setHasChanges(true);
    toast.success("Image removed");
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
    
    setImages(newImages);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real application, we would save changes to a database here
    console.log("Saving hero images:", images);
    toast.success("Hero images updated successfully");
    setHasChanges(false);
  };

  const handleResetChanges = () => {
    setImages(initialHeroImages);
    setHasChanges(false);
    toast.info("Changes reset");
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
                <Plus className="mr-2 h-4 w-4" /> Add New Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Hero Image</DialogTitle>
                <DialogDescription>
                  Enter the URL of the image you want to add to the hero slideshow.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="imageUrl">Image URL</label>
                  <Input 
                    id="imageUrl" 
                    placeholder="https://example.com/image.jpg" 
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)} 
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="imageDescription">Description (optional)</label>
                  <Textarea 
                    id="imageDescription" 
                    placeholder="Describe the image" 
                    value={imageDescription}
                    onChange={(e) => setImageDescription(e.target.value)} 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddImage}>Add Image</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative mt-6">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative group">
                    <div className="aspect-video overflow-hidden rounded-md border border-border">
                      <img
                        src={image}
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
                        onClick={() => handleRemoveImage(index)}
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
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleResetChanges}
          disabled={!hasChanges}
        >
          Reset Changes
        </Button>
        <Button
          onClick={handleSaveChanges}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
