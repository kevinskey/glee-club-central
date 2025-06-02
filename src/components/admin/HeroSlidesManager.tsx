
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Images, Loader2, Plus, ArrowUp, ArrowDown } from "lucide-react";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HeroSlideEditor } from "./HeroSlideEditor";
import { HeroGlobalSettings } from "./HeroGlobalSettings";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface HeroSlide {
  id: string;
  media_id?: string;
  media_type: 'image' | 'video';
  title: string;
  description: string;
  button_text?: string;
  button_link?: string;
  text_position: 'top' | 'center' | 'bottom';
  text_alignment: 'left' | 'center' | 'right';
  visible: boolean;
  slide_order: number;
  created_at: string;
  updated_at: string;
}

export function HeroSlidesManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectImageDialogOpen, setSelectImageDialogOpen] = useState(false);
  
  const { filteredMediaFiles, fetchAllMedia } = useMediaLibrary();

  useEffect(() => {
    fetchSlides();
    fetchAllMedia();
  }, []);

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('slide_order', { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching hero slides:', error);
      toast.error('Failed to load hero slides');
    } finally {
      setIsLoading(false);
    }
  };

  const createSlideFromImage = async (mediaFile: any) => {
    try {
      const nextOrder = slides.length;
      
      const { error } = await supabase
        .from('hero_slides')
        .insert({
          media_id: mediaFile.id,
          media_type: mediaFile.file_type.startsWith('video/') ? 'video' : 'image',
          title: 'Your Slide Title',
          description: 'Your slide description here.',
          text_position: 'center',
          text_alignment: 'center',
          visible: false,
          slide_order: nextOrder
        });

      if (error) throw error;
      
      toast.success("New slide created successfully");
      setSelectImageDialogOpen(false);
      await fetchSlides();
    } catch (error) {
      console.error("Error creating slide:", error);
      toast.error("Failed to create slide");
    }
  };

  const createEmptySlide = async () => {
    try {
      const nextOrder = slides.length;
      
      const { error } = await supabase
        .from('hero_slides')
        .insert({
          media_type: 'image',
          title: 'Your Slide Title',
          description: 'Your slide description here.',
          text_position: 'center',
          text_alignment: 'center',
          visible: false,
          slide_order: nextOrder
        });

      if (error) throw error;
      
      toast.success("New slide created successfully");
      await fetchSlides();
    } catch (error) {
      console.error("Error creating slide:", error);
      toast.error("Failed to create slide");
    }
  };

  const moveSlide = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === slides.length - 1)
    ) {
      return;
    }

    const newSlides = [...slides];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    
    // Update slide_order values
    newSlides[index].slide_order = index;
    newSlides[newIndex].slide_order = newIndex;

    try {
      // Update positions in database
      await Promise.all([
        supabase.from('hero_slides').update({ slide_order: newSlides[index].slide_order }).eq('id', newSlides[index].id),
        supabase.from('hero_slides').update({ slide_order: newSlides[newIndex].slide_order }).eq('id', newSlides[newIndex].id)
      ]);

      setSlides(newSlides);
      toast.success("Slide order updated");
    } catch (error) {
      console.error("Error updating slide order:", error);
      toast.error("Failed to update slide order");
    }
  };

  const handleSlideDelete = (slideId: string) => {
    setSlides(slides.filter(slide => slide.id !== slideId));
  };

  const imageLibrary = filteredMediaFiles.filter(file => 
    file.file_type?.startsWith('image/') || file.file_type?.startsWith('video/')
  );

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="h-5 w-5" />
            Hero Slides Manager
            {slides.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {slides.length} slide{slides.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Create and manage individual hero slides with custom text, buttons, and links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2">
              <Button onClick={createEmptySlide} variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Empty Slide
              </Button>
              
              <Dialog open={selectImageDialogOpen} onOpenChange={setSelectImageDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-glee-purple hover:bg-glee-purple/90">
                    <Plus className="mr-2 h-4 w-4" /> Add from Media Library
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Select Media for New Hero Slide</DialogTitle>
                    <DialogDescription>
                      Choose an image or video from your media library to create a new hero slide.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-h-96 overflow-y-auto">
                    {imageLibrary.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {imageLibrary.map((mediaFile) => (
                          <div
                            key={mediaFile.id}
                            className="relative cursor-pointer border rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all duration-200"
                            onClick={() => createSlideFromImage(mediaFile)}
                          >
                            <AspectRatio ratio={16/9}>
                              {mediaFile.file_type?.startsWith('video/') ? (
                                <video
                                  src={mediaFile.file_url}
                                  className="w-full h-full object-cover"
                                  muted
                                  onError={(e) => {
                                    (e.target as HTMLVideoElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <img
                                  src={mediaFile.file_url}
                                  alt={mediaFile.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/640x360?text=Media+Not+Found";
                                  }}
                                />
                              )}
                            </AspectRatio>
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                                <Plus className="h-8 w-8 text-white" />
                              </div>
                            </div>
                            <div className="p-2 bg-background/95 backdrop-blur">
                              <p className="text-sm font-medium truncate">{mediaFile.title}</p>
                              <Badge variant="outline" className="text-xs">
                                {mediaFile.file_type?.startsWith('video/') ? 'Video' : 'Image'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <Images className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No media found in library</p>
                        <p className="text-sm">Upload some images or videos to the media library first</p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Separator className="mb-6" />

          <div className="relative">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading hero slides...</span>
              </div>
            ) : slides.length === 0 ? (
              <div className="text-center p-12 border-2 border-dashed rounded-lg">
                <Images className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-xl mb-2">No hero slides configured</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create hero slides with custom text, buttons, and links for your homepage slideshow.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={createEmptySlide} size="lg" variant="outline">
                    <Plus className="mr-2 h-5 w-5" /> Add Empty Slide
                  </Button>
                  <Button onClick={() => setSelectImageDialogOpen(true)} size="lg">
                    <Plus className="mr-2 h-5 w-5" /> Add from Media Library
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium">
                    Hero Slides ({slides.length})
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Click edit on any slide to customize content and settings
                  </p>
                </div>
                
                <div className="space-y-4">
                  {slides.map((slide, index) => (
                    <div key={slide.id} className="relative">
                      <div className="absolute -left-12 top-4 flex flex-col gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveSlide(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveSlide(index, 'down')}
                          disabled={index === slides.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <HeroSlideEditor
                        slide={slide}
                        onUpdate={fetchSlides}
                        onDelete={handleSlideDelete}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <HeroGlobalSettings />
    </div>
  );
}
