import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSimpleHero } from '@/hooks/useSimpleHero';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

export function SimpleHeroManager() {
  const { slides, isLoading, refetch } = useSimpleHero('homepage-main');
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [newSlide, setNewSlide] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    textPosition: 'center' as const,
    textAlignment: 'center' as const
  });

  const createSlide = async () => {
    if (!newSlide.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const { error } = await supabase
        .from('hero_slides')
        .insert({
          section_id: 'homepage-main',
          title: newSlide.title,
          description: newSlide.description,
          button_text: newSlide.buttonText || null,
          button_link: newSlide.buttonLink || null,
          text_position: newSlide.textPosition,
          text_alignment: newSlide.textAlignment,
          visible: true,
          slide_order: slides.length
        });

      if (error) throw error;

      toast.success('Slide created successfully');
      setNewSlide({
        title: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        textPosition: 'center',
        textAlignment: 'center'
      });
      refetch();
    } catch (error) {
      console.error('Error creating slide:', error);
      toast.error('Failed to create slide');
    }
  };

  const deleteSlide = async (slideId: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      toast.success('Slide deleted successfully');
      refetch();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading hero slides...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simple Hero Manager</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create New Slide Form */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Create New Slide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Slide title"
                value={newSlide.title}
                onChange={(e) => setNewSlide(prev => ({ ...prev, title: e.target.value }))}
              />
              <div className="flex gap-2">
                <Select 
                  value={newSlide.textPosition} 
                  onValueChange={(value: 'top' | 'center' | 'bottom') => 
                    setNewSlide(prev => ({ ...prev, textPosition: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={newSlide.textAlignment} 
                  onValueChange={(value: 'left' | 'center' | 'right') => 
                    setNewSlide(prev => ({ ...prev, textAlignment: value }))
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Textarea
              placeholder="Slide description"
              value={newSlide.description}
              onChange={(e) => setNewSlide(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Button text (optional)"
                value={newSlide.buttonText}
                onChange={(e) => setNewSlide(prev => ({ ...prev, buttonText: e.target.value }))}
              />
              <Input
                placeholder="Button link (optional)"
                value={newSlide.buttonLink}
                onChange={(e) => setNewSlide(prev => ({ ...prev, buttonLink: e.target.value }))}
              />
            </div>
            <Button onClick={createSlide} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Slide
            </Button>
          </div>

          {/* Existing Slides */}
          <div className="space-y-4">
            <h3 className="font-medium">Current Slides ({slides.length})</h3>
            {slides.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No slides configured. Create your first slide above.
              </div>
            ) : (
              slides.map((slide, index) => (
                <div key={slide.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{slide.title}</h4>
                      <p className="text-sm text-muted-foreground">{slide.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{slide.textPosition}</Badge>
                        <Badge variant="outline">{slide.textAlignment}</Badge>
                        {slide.buttonText && (
                          <Badge variant="secondary">Has Button</Badge>
                        )}
                        {slide.imageUrl && (
                          <Badge variant="default">Has Image</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingSlide(slide.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteSlide(slide.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {slide.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-32 h-20 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
