
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeroTextPositionEditor } from './HeroTextPositionEditor';
import { MediaPicker } from '@/components/media/MediaPicker';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AdvancedHeroSlideEditorProps {
  slide: {
    id: string;
    title: string;
    description: string;
    media_id?: string;
    media_type: 'image' | 'video';
    text_position: 'top' | 'center' | 'bottom';
    text_alignment: 'left' | 'center' | 'right';
    button_text?: string;
    button_link?: string;
    slide_order: number;
    section_id?: string;
  };
  onUpdate: () => void;
  onCancel: () => void;
}

export function AdvancedHeroSlideEditor({ slide, onUpdate, onCancel }: AdvancedHeroSlideEditorProps) {
  const [formData, setFormData] = useState({
    title: slide.title,
    description: slide.description,
    media_id: slide.media_id,
    media_type: slide.media_type,
    text_position: slide.text_position,
    text_alignment: slide.text_alignment,
    button_text: slide.button_text || '',
    button_link: slide.button_link || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('hero_slides')
        .update(formData)
        .eq('id', slide.id);

      if (error) throw error;

      toast.success('Slide updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaSelect = (data: string | { id: string; file_type: string; file_url: string }) => {
    if (typeof data === 'string') {
      // Handle string URL (external URL case)
      console.log('External URL selected:', data);
      // For external URLs, we might need to handle this differently
      // For now, we'll skip this case since we're using returnMediaObject=true
    } else {
      // Handle media object
      setFormData(prev => ({
        ...prev,
        media_id: data.id,
        media_type: data.file_type.startsWith('video/') ? 'video' : 'image'
      }));
    }
    setShowMediaPicker(false);
  };

  const handleTextUpdate = (updates: any) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Hero Slide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter slide title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="media-type">Media Type</Label>
              <Select 
                value={formData.media_type} 
                onValueChange={(value: 'image' | 'video') => 
                  setFormData(prev => ({ ...prev, media_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter slide description"
              rows={3}
            />
          </div>

          {/* Media Selection */}
          <div className="space-y-2">
            <Label>Background Media</Label>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowMediaPicker(true)}
              className="w-full"
            >
              {formData.media_id ? 'Change Media' : 'Select Media'}
            </Button>
          </div>

          {/* Traditional Text Positioning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="text-position">Text Position</Label>
              <Select 
                value={formData.text_position} 
                onValueChange={(value: 'top' | 'center' | 'bottom') => 
                  setFormData(prev => ({ ...prev, text_position: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-alignment">Text Alignment</Label>
              <Select 
                value={formData.text_alignment} 
                onValueChange={(value: 'left' | 'center' | 'right') => 
                  setFormData(prev => ({ ...prev, text_alignment: value }))
                }
              >
                <SelectTrigger>
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

          {/* Call to Action Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text (Optional)</Label>
              <Input
                id="button-text"
                value={formData.button_text}
                onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                placeholder="e.g., Learn More"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="button-link">Button Link (Optional)</Label>
              <Input
                id="button-link"
                value={formData.button_link}
                onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                placeholder="e.g., /about or https://example.com"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Text Positioning */}
      <HeroTextPositionEditor
        slideId={slide.id}
        title={formData.title}
        description={formData.description}
        onUpdate={handleTextUpdate}
      />

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={handleMediaSelect}
          allowedTypes={['image', 'video']}
          showUpload={true}
          returnMediaObject={true}
        />
      )}
    </div>
  );
}
