
import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { MediaPicker } from '@/components/media/MediaPicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface EventEditorProps {
  event?: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id' | 'created_at'>) => Promise<void>;
}

const STORAGE_KEY = 'glee-event-editor-data';

export const EventEditor: React.FC<EventEditorProps> = ({
  event,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    start_time: '',
    end_time: '',
    location_name: '',
    location_map_url: '',
    feature_image_url: '',
    short_description: '',
    full_description: '',
    event_host_name: '',
    event_host_contact: '',
    is_private: false,
    allow_rsvp: false,
    allow_reminders: false,
    allow_ics_download: true,
    allow_google_map_link: true,
  });

  const [loading, setLoading] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [showRestoreAlert, setShowRestoreAlert] = useState(false);

  // Save to localStorage whenever form data changes (but not when editing existing events)
  useEffect(() => {
    if (isOpen && !event) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        formData,
        timestamp: Date.now(),
        isCreating: true
      }));
    }
  }, [formData, isOpen, event]);

  // Load saved data when component opens
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event - populate with event data
        setFormData({
          title: event.title || '',
          start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
          end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
          location_name: event.location_name || '',
          location_map_url: event.location_map_url || '',
          feature_image_url: event.feature_image_url || '',
          short_description: event.short_description || '',
          full_description: event.full_description || '',
          event_host_name: event.event_host_name || '',
          event_host_contact: event.event_host_contact || '',
          is_private: event.is_private || false,
          allow_rsvp: event.allow_rsvp || false,
          allow_reminders: event.allow_reminders || false,
          allow_ics_download: event.allow_ics_download ?? true,
          allow_google_map_link: event.allow_google_map_link ?? true,
        });
      } else {
        // Creating new event - check for saved data
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            // Check if we have meaningful data to restore
            if (parsed.formData && (parsed.formData.title || parsed.formData.short_description)) {
              setShowRestoreAlert(true);
            }
          } catch (error) {
            console.error('Error parsing saved data:', error);
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    }
  }, [isOpen, event]);

  const restoreSavedData = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData);
        setShowRestoreAlert(false);
        toast.success('Draft restored');
      } catch (error) {
        console.error('Error restoring data:', error);
        toast.error('Failed to restore draft');
      }
    }
  };

  const discardSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowRestoreAlert(false);
    toast.info('Draft discarded');
  };

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
      } as Omit<CalendarEvent, 'id' | 'created_at'>);
      
      clearSavedData(); // Clear saved data on successful save
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (imageUrl: string) => {
    handleInputChange('feature_image_url', imageUrl);
    setIsMediaPickerOpen(false);
  };

  const handleClose = () => {
    // Don't clear data when closing - let it persist
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        {showRestoreAlert && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You have unsaved draft data. Would you like to restore it?</span>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={restoreSavedData}>
                  Restore
                </Button>
                <Button variant="ghost" size="sm" onClick={discardSavedData}>
                  Discard
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Start Date & Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">End Date & Time</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => handleInputChange('end_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="full_description">Full Description</Label>
            <Textarea
              id="full_description"
              value={formData.full_description}
              onChange={(e) => handleInputChange('full_description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location_name">Location</Label>
              <Input
                id="location_name"
                value={formData.location_name}
                onChange={(e) => handleInputChange('location_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location_map_url">Map URL</Label>
              <Input
                id="location_map_url"
                value={formData.location_map_url}
                onChange={(e) => handleInputChange('location_map_url', e.target.value)}
                placeholder="https://maps.google.com/..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_host_name">Host Name</Label>
              <Input
                id="event_host_name"
                value={formData.event_host_name}
                onChange={(e) => handleInputChange('event_host_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="event_host_contact">Host Contact</Label>
              <Input
                id="event_host_contact"
                value={formData.event_host_contact}
                onChange={(e) => handleInputChange('event_host_contact', e.target.value)}
                placeholder="email or phone"
              />
            </div>
          </div>

          <div>
            <Label>Event Image</Label>
            <div className="space-y-2">
              {formData.feature_image_url && (
                <div className="border rounded-lg p-2">
                  <img 
                    src={formData.feature_image_url} 
                    alt="Event preview"
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMediaPickerOpen(true)}
                className="w-full"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {formData.feature_image_url ? 'Change Image' : 'Select Image'}
              </Button>
              {formData.feature_image_url && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleInputChange('feature_image_url', '')}
                  className="w-full text-red-600 hover:text-red-700"
                >
                  Remove Image
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Event Settings</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="is_private">Private Event (Members Only)</Label>
              <Switch
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={(checked) => handleInputChange('is_private', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allow_rsvp">Allow RSVP</Label>
              <Switch
                id="allow_rsvp"
                checked={formData.allow_rsvp}
                onCheckedChange={(checked) => handleInputChange('allow_rsvp', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allow_reminders">Send Reminders</Label>
              <Switch
                id="allow_reminders"
                checked={formData.allow_reminders}
                onCheckedChange={(checked) => handleInputChange('allow_reminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allow_ics_download">Allow Calendar Download</Label>
              <Switch
                id="allow_ics_download"
                checked={formData.allow_ics_download}
                onCheckedChange={(checked) => handleInputChange('allow_ics_download', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allow_google_map_link">Show Map Link</Label>
              <Switch
                id="allow_google_map_link"
                checked={formData.allow_google_map_link}
                onCheckedChange={(checked) => handleInputChange('allow_google_map_link', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Event'}
            </Button>
          </div>
        </form>

        <MediaPicker
          isOpen={isMediaPickerOpen}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={handleImageSelect}
          currentImageUrl={formData.feature_image_url}
        />
      </DialogContent>
    </Dialog>
  );
};
