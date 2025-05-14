
import React, { useState, useEffect } from 'react';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarEvent, EventType } from '@/types/calendar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface EventModalProps {
  onClose: () => void;
  onSave: (event: any) => Promise<boolean | void>;
  initialDate?: Date | null;
  initialData?: CalendarEvent;
}

export function EventModal({ onClose, onSave, initialDate, initialData }: EventModalProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Initialize state with initialData if provided (for edit mode)
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date 
    ? typeof initialData.date === 'string' 
      ? initialData.date 
      : format(initialData.date, 'yyyy-MM-dd')
    : initialDate 
      ? format(initialDate, 'yyyy-MM-dd') 
      : format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(initialData?.time || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<EventType>(initialData?.type as EventType || 'special');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || '');

  // Handle image selection
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
    
    setSelectedImage(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Handle type selection (fixing the type issue)
  const handleTypeChange = (value: string) => {
    setType(value as EventType);
  };

  const handleSave = async () => {
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    if (!date) {
      toast.error('Please select a date');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload image if selected
      let imageUrl = initialData?.image_url || null;
      
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `event-images/${fileName}`;
        
        const { data, error } = await supabase
          .storage
          .from('event-images')
          .upload(filePath, selectedImage);
        
        if (error) {
          throw new Error(`Error uploading image: ${error.message}`);
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('event-images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }
      
      const eventData = {
        title,
        date,
        time,
        location,
        description,
        type,
        image_url: imageUrl,
        created_by: user?.id
      };
      
      await onSave(eventData);
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('Failed to save event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{initialData ? 'Edit Event' : 'Create Event'}</DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="date">Date*</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="type">Event Type</Label>
            <Select 
              value={type} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="type" className="mt-1">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concert">Concert</SelectItem>
                <SelectItem value="rehearsal">Rehearsal</SelectItem>
                <SelectItem value="sectional">Sectional</SelectItem>
                <SelectItem value="special">Special Event</SelectItem>
                <SelectItem value="tour">Tour</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              className="mt-1 min-h-[100px]"
            />
          </div>
          
          <div>
            <Label htmlFor="image">Event Image</Label>
            <div className="mt-1 flex items-center">
              <label 
                htmlFor="image-upload" 
                className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Upload size={16} />
                <span>Upload Image</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Image preview */}
            {imagePreview && (
              <div className="mt-3">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="max-h-48 rounded-md object-cover"
                />
                <button 
                  type="button"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                  onClick={() => {
                    setImagePreview('');
                    setSelectedImage(null);
                  }}
                >
                  Remove image
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="button"
          onClick={handleSave} 
          disabled={isSubmitting || !title || !date}
        >
          {isSubmitting ? 'Saving...' : (initialData ? 'Update' : 'Create')}
        </Button>
      </DialogFooter>
    </>
  );
}
