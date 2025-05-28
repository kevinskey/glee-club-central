
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

const DRAFT_STORAGE_KEY = 'event-editor-draft';
const EDITOR_STATE_KEY = 'event-editor-state';

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [hasDraftData, setHasDraftData] = useState(false);
  const [showDraftAlert, setShowDraftAlert] = useState(false);

  // Check for draft data on mount
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      const savedState = localStorage.getItem(EDITOR_STATE_KEY);
      
      if (savedDraft && savedState && !event) {
        const draftData = JSON.parse(savedDraft);
        const stateData = JSON.parse(savedState);
        
        // Only show draft alert if we have meaningful data
        if (draftData.title || draftData.short_description) {
          setHasDraftData(true);
          setShowDraftAlert(true);
        }
      } else if (event) {
        // Populate with event data for editing
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
      }
    }
  }, [isOpen, event]);

  // Auto-save draft every 2 seconds when there are changes
  useEffect(() => {
    if (!isOpen || event) return; // Don't save drafts when editing existing events
    
    const timeoutId = setTimeout(() => {
      if (hasUnsavedChanges) {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
        localStorage.setItem(EDITOR_STATE_KEY, JSON.stringify({ 
          isCreating: true, 
          timestamp: Date.now() 
        }));
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, hasUnsavedChanges, isOpen, event]);

  // Track if form has been modified
  useEffect(() => {
    const isModified = formData.title !== (event?.title || '') ||
      formData.short_description !== (event?.short_description || '') ||
      formData.full_description !== (event?.full_description || '') ||
      formData.location_name !== (event?.location_name || '') ||
      formData.event_host_name !== (event?.event_host_name || '');
    setHasUnsavedChanges(isModified);
  }, [formData, event]);

  const restoreDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      const draftData = JSON.parse(savedDraft);
      setFormData(draftData);
      setShowDraftAlert(false);
      setHasDraftData(false);
      toast.success('Draft restored');
    }
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(EDITOR_STATE_KEY);
    setShowDraftAlert(false);
    setHasDraftData(false);
    toast.info('Draft discarded');
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    localStorage.removeItem(EDITOR_STATE_KEY);
  };

  // Prevent accidental closing when there are unsaved changes
  const handleCloseAttempt = (open: boolean) => {
    if (!open && (hasUnsavedChanges || hasDraftData)) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) {
        return; // Prevent closing
      }
    }
    if (!open) {
      onClose();
    }
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
      
      setHasUnsavedChanges(false);
      clearDraft(); // Clear draft on successful save
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

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Create New Event'}
            {hasUnsavedChanges && <span className="text-amber-500 ml-2">*</span>}
          </DialogTitle>
        </DialogHeader>

        {showDraftAlert && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You have unsaved draft data. Would you like to restore it?</span>
              <div className="flex gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={restoreDraft}>
                  Restore
                </Button>
                <Button variant="ghost" size="sm" onClick={discardDraft}>
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
              onClick={() => handleCloseAttempt(false)}
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
