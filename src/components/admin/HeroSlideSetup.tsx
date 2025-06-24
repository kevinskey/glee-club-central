
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function HeroSlideSetup() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_slides')
        .select(`
          *,
          media_library(file_url, title, file_type)
        `)
        .eq('section_id', 'homepage-main')
        .order('slide_order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast.error('Failed to fetch slides');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultSlides = async () => {
    try {
      setLoading(true);
      
      // First, get existing media files that match our fallback images
      const { data: mediaFiles, error: mediaError } = await supabase
        .from('media_library')
        .select('*')
        .in('file_url', [
          '/lovable-uploads/10bab1e7-0f4e-402f-ab65-feb4710b5eaf.png',
          '/lovable-uploads/1536a1d1-51f6-4121-8f53-423d37672f2e.png',
          '/lovable-uploads/312fd1a4-7f46-4000-8711-320383aa565a.png'
        ]);

      if (mediaError) throw mediaError;

      const slideData = [
        {
          title: 'Spelman College Glee Club',
          description: 'To Amaze and Inspire',
          media_id: mediaFiles?.find(m => m.file_url.includes('10bab1e7'))?.id,
          slide_order: 0,
          visible: true,
          section_id: 'homepage-main',
          button_text: 'Learn More',
          button_link: '/about',
          text_position: 'center',
          text_alignment: 'center',
          show_title: true
        },
        {
          title: 'Excellence in Performance',
          description: 'Discover our musical journey',
          media_id: mediaFiles?.find(m => m.file_url.includes('1536a1d1'))?.id,
          slide_order: 1,
          visible: true,
          section_id: 'homepage-main',
          button_text: 'View Events',
          button_link: '/events',
          text_position: 'center',
          text_alignment: 'center',
          show_title: true
        },
        {
          title: 'Join Our Community',
          description: 'Be part of something special',
          media_id: mediaFiles?.find(m => m.file_url.includes('312fd1a4'))?.id,
          slide_order: 2,
          visible: true,
          section_id: 'homepage-main',
          button_text: 'Join Glee Fam',
          button_link: '/join-glee-fam',
          text_position: 'center',
          text_alignment: 'center',
          show_title: true
        }
      ];

      const { error: insertError } = await supabase
        .from('hero_slides')
        .insert(slideData.filter(slide => slide.media_id)); // Only insert slides with valid media

      if (insertError) throw insertError;

      toast.success('Default hero slides created successfully!');
      fetchSlides();
    } catch (error) {
      console.error('Error creating default slides:', error);
      toast.error('Failed to create default slides');
    } finally {
      setLoading(false);
    }
  };

  const toggleSlideVisibility = async (slideId: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('hero_slides')
        .update({ visible })
        .eq('id', slideId);

      if (error) throw error;
      
      setSlides(prev => prev.map(slide => 
        slide.id === slideId ? { ...slide, visible } : slide
      ));
      
      toast.success(`Slide ${visible ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Hero Slides Configuration</h3>
          <p className="text-sm text-gray-600">
            {slides.length === 0 
              ? 'No hero slides configured. Using fallback images.' 
              : `${slides.filter(s => s.visible).length} of ${slides.length} slides active`
            }
          </p>
        </div>
        {slides.length === 0 && (
          <Button onClick={createDefaultSlides} disabled={loading}>
            Create Default Slides
          </Button>
        )}
      </div>

      {slides.length > 0 ? (
        <div className="grid gap-4">
          {slides.map((slide) => (
            <Card key={slide.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{slide.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={slide.visible ? "default" : "secondary"}>
                      {slide.visible ? "Active" : "Hidden"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSlideVisibility(slide.id, !slide.visible)}
                    >
                      {slide.visible ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {slide.media_library?.file_url && (
                    <img 
                      src={slide.media_library.file_url}
                      alt={slide.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{slide.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Order: {slide.slide_order}</span>
                      <span>Position: {slide.text_position}</span>
                      {slide.button_text && (
                        <span>Button: {slide.button_text}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No hero slides found. The homepage is currently showing fallback images.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Click "Create Default Slides" to set up proper hero slides using your existing images.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
