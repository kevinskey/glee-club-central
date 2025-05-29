import React, { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '@/types/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Image as ImageIcon, AlertCircle, MapPin, ChevronDown, Check, Loader2 } from 'lucide-react';
import { MediaPicker } from '@/components/media/MediaPicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { EVENT_TYPES, getEventTypeColor } from '@/utils/eventTypes';
import { AIDescriptionButtons } from './AIDescriptionButtons';

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
    call_time: '',
    location_name: '',
    location_map_url: '',
    feature_image_url: '',
    short_description: '',
    full_description: '',
    event_host_name: '',
    event_host_contact: '',
    event_types: [] as string[],
    is_private: false,
    allow_rsvp: false,
    allow_reminders: false,
    allow_ics_download: true,
    allow_google_map_link: true,
  });

  const [loading, setLoading] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [showRestoreAlert, setShowRestoreAlert] = useState(false);
  const [isEventTypesOpen, setIsEventTypesOpen] = useState(false);
  const [googleMapsStatus, setGoogleMapsStatus] = useState<'loading' | 'ready' | 'error' | 'unavailable'>('loading');
  const [showManualLocationInput, setShowManualLocationInput] = useState(false);
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (!isOpen) return;

    const initializeGoogleMaps = async () => {
      try {
        // Check if API key is available
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.warn('Google Maps API key not found');
          setGoogleMapsStatus('unavailable');
          setShowManualLocationInput(true);
          return;
        }

        console.log('Initializing Google Maps with API key');
        setGoogleMapsStatus('loading');

        // Load Google Maps API
        const { Loader } = await import('@googlemaps/js-api-loader');
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        });

        await loader.load();
        console.log('Google Maps API loaded successfully');

        if (locationInputRef.current && !autocompleteRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(
            locationInputRef.current,
            {
              types: ['establishment', 'geocode'],
              fields: ['formatted_address', 'name', 'place_id', 'url']
            }
          );

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
              setFormData(prev => ({
                ...prev,
                location_name: place.formatted_address,
                location_map_url: place.url || ''
              }));
              toast.success('Location selected from Google Maps');
            }
          });

          setGoogleMapsStatus('ready');
          console.log('Google Places Autocomplete initialized');
        }
      } catch (error) {
        console.error('Failed to initialize Google Maps:', error);
        setGoogleMapsStatus('error');
        setShowManualLocationInput(true);
        toast.error('Google Maps unavailable. You can enter location manually.');
      }
    };

    // Reset status when dialog opens
    if (isOpen && locationInputRef.current) {
      initializeGoogleMaps();
    }

    return () => {
      if (autocompleteRef.current) {
        try {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        } catch (error) {
          console.warn('Error cleaning up Google Maps listeners:', error);
        }
        autocompleteRef.current = null;
      }
    };
  }, [isOpen]);

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
        const eventTypes = event.event_types || (event.event_type ? [event.event_type] : []);
        setFormData({
          title: event.title || '',
          start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
          end_time: event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : '',
          call_time: event.call_time ? new Date(event.call_time).toISOString().slice(0, 16) : '',
          location_name: event.location_name || '',
          location_map_url: event.location_map_url || '',
          feature_image_url: event.feature_image_url || '',
          short_description: event.short_description || '',
          full_description: event.full_description || '',
          event_host_name: event.event_host_name || '',
          event_host_contact: event.event_host_contact || '',
          event_types: eventTypes,
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
      const eventData = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        call_time: formData.call_time ? new Date(formData.call_time).toISOString() : undefined,
        event_type: formData.event_types[0] || 'event',
      };
      
      await onSave(eventData as Omit<CalendarEvent, 'id' | 'created_at'>);
      
      clearSavedData();
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

  const handleEventTypeToggle = (typeValue: string) => {
    setFormData(prev => ({
      ...prev,
      event_types: prev.event_types.includes(typeValue)
        ? prev.event_types.filter(t => t !== typeValue)
        : [...prev.event_types, typeValue]
    }));
  };

  const handleImageSelect = (imageUrl: string) => {
    handleInputChange('feature_image_url', imageUrl);
    setIsMediaPickerOpen(false);
  };

  const handleClose = () => {
    onClose();
  };

  const handleEventTypesDone = () => {
    setIsEventTypesOpen(false);
  };

  const toggleManualLocationInput = () => {
    setShowManualLocationInput(!showManualLocationInput);
  };

  const getLocationInputStatus = () => {
    switch (googleMapsStatus) {
      case 'loading':
        return (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            Loading Google Maps...
          </div>
        );
      case 'ready':
        return (
          <p className="text-xs text-green-600 mt-1">
            ✓ Google Maps autocomplete ready
          </p>
        );
      case 'error':
        return (
          <p className="text-xs text-amber-600 mt-1">
            ⚠ Google Maps failed to load. Manual input available.
          </p>
        );
      case 'unavailable':
        return (
          <p className="text-xs text-muted-foreground mt-1">
            Google Maps not configured. Using manual input.
          </p>
        );
      default:
        return null;
    }
  };

  const handleAIDescriptionGenerated = (description: string, type: 'short' | 'full') => {
    if (type === 'short') {
      handleInputChange('short_description', description);
    } else {
      handleInputChange('full_description', description);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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

          <div>
            <Label>Event Types</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEventTypesOpen(!isEventTypesOpen)}
                className="w-full justify-between"
              >
                {formData.event_types.length > 0
                  ? `${formData.event_types.length} type${formData.event_types.length > 1 ? 's' : ''} selected`
                  : "Select event types..."}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
              
              {isEventTypesOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-lg shadow-lg p-4">
                  <div className="hidden md:block">
                    <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                      {EVENT_TYPES.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-sm">
                          <Checkbox
                            id={type.value}
                            checked={formData.event_types.includes(type.value)}
                            onCheckedChange={() => handleEventTypeToggle(type.value)}
                          />
                          <label
                            htmlFor={type.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4 pt-3 border-t">
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm" 
                        onClick={handleEventTypesDone}
                        className="bg-glee-purple hover:bg-glee-purple/90"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                  <div className="md:hidden">
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {EVENT_TYPES.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2 p-2 hover:bg-muted rounded-sm">
                          <Checkbox
                            id={type.value}
                            checked={formData.event_types.includes(type.value)}
                            onCheckedChange={() => handleEventTypeToggle(type.value)}
                          />
                          <label
                            htmlFor={type.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                          >
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4 pt-3 border-t">
                      <Button 
                        type="button" 
                        variant="default" 
                        size="sm" 
                        onClick={handleEventTypesDone}
                        className="bg-glee-purple hover:bg-glee-purple/90"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {formData.event_types.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.event_types.map((type) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className={`text-xs ${getEventTypeColor(type)}`}
                  >
                    {EVENT_TYPES.find(t => t.value === type)?.label || type}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Label htmlFor="call_time">Call Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
                <Input
                  id="call_time"
                  type="datetime-local"
                  value={formData.call_time}
                  onChange={(e) => handleInputChange('call_time', e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                When members should arrive
              </p>
            </div>
            <div className="relative">
              <Label htmlFor="start_time">Start Date & Time</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => handleInputChange('start_time', e.target.value)}
                required
              />
            </div>
            <div className="relative">
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
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="short_description">Short Description</Label>
              <AIDescriptionButtons
                title={formData.title}
                eventTypes={formData.event_types}
                location={formData.location_name}
                startTime={formData.start_time}
                callTime={formData.call_time}
                onDescriptionGenerated={handleAIDescriptionGenerated}
              />
            </div>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
              rows={2}
              placeholder="Brief description of the event..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="full_description">Full Description</Label>
              <AIDescriptionButtons
                title={formData.title}
                eventTypes={formData.event_types}
                location={formData.location_name}
                startTime={formData.start_time}
                callTime={formData.call_time}
                onDescriptionGenerated={handleAIDescriptionGenerated}
              />
            </div>
            <Textarea
              id="full_description"
              value={formData.full_description}
              onChange={(e) => handleInputChange('full_description', e.target.value)}
              rows={4}
              placeholder="Detailed description of the event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="location_name">Location</Label>
                {(googleMapsStatus === 'error' || googleMapsStatus === 'unavailable') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleManualLocationInput}
                    className="text-xs"
                  >
                    {showManualLocationInput ? 'Use Autocomplete' : 'Manual Input'}
                  </Button>
                )}
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  ref={googleMapsStatus === 'ready' && !showManualLocationInput ? locationInputRef : undefined}
                  id="location_name"
                  value={formData.location_name}
                  onChange={(e) => handleInputChange('location_name', e.target.value)}
                  placeholder={showManualLocationInput ? "Enter location manually..." : "Start typing an address..."}
                  className="pl-10"
                  disabled={googleMapsStatus === 'loading'}
                />
              </div>
              {getLocationInputStatus()}
            </div>
            <div>
              <Label htmlFor="location_map_url">Map URL</Label>
              <Input
                id="location_map_url"
                value={formData.location_map_url}
                onChange={(e) => handleInputChange('location_map_url', e.target.value)}
                placeholder={showManualLocationInput ? "Enter map URL manually..." : "Auto-filled from location search"}
                readOnly={!showManualLocationInput && googleMapsStatus === 'ready'}
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

          {/* Two Column Layout: Event Image (50%) and Event Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Event Image (50%) */}
            <div>
              <Label>Event Image</Label>
              <div className="space-y-2">
                {formData.feature_image_url && (
                  <div className="border rounded-lg p-2">
                    <img 
                      src={formData.feature_image_url} 
                      alt="Event preview"
                      className="w-full h-64 object-cover rounded"
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

            {/* Right Column - Event Settings */}
            <div>
              <div className="space-y-4 p-4 border rounded-lg h-full">
                <h3 className="font-semibold">Event Settings</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_private" className="text-sm">Private Event (Members Only)</Label>
                  <Switch
                    id="is_private"
                    checked={formData.is_private}
                    onCheckedChange={(checked) => handleInputChange('is_private', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allow_rsvp" className="text-sm">Allow RSVP</Label>
                  <Switch
                    id="allow_rsvp"
                    checked={formData.allow_rsvp}
                    onCheckedChange={(checked) => handleInputChange('allow_rsvp', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allow_reminders" className="text-sm">Send Reminders</Label>
                  <Switch
                    id="allow_reminders"
                    checked={formData.allow_reminders}
                    onCheckedChange={(checked) => handleInputChange('allow_reminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allow_ics_download" className="text-sm">Allow Calendar Download</Label>
                  <Switch
                    id="allow_ics_download"
                    checked={formData.allow_ics_download}
                    onCheckedChange={(checked) => handleInputChange('allow_ics_download', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allow_google_map_link" className="text-sm">Show Map Link</Label>
                  <Switch
                    id="allow_google_map_link"
                    checked={formData.allow_google_map_link}
                    onCheckedChange={(checked) => handleInputChange('allow_google_map_link', checked)}
                  />
                </div>
              </div>
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
