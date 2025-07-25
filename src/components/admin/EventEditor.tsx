
import React, { useState, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EventAssignmentManager } from "./EventAssignmentManager";
import { EventImageUpload } from "./EventImageUpload";
import { PerformerSelector } from "./PerformerSelector";
import { EventTypeSelector } from "./EventTypeSelector";
import { RecurrenceSettings } from "./RecurrenceSettings";
import { Calendar, Clock, MapPin, Users, Music, Repeat } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface EventEditorProps {
  event?: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id" | "created_at">) => Promise<void>;
}

interface RecurrentEventData {
  is_recurring: boolean;
  recurrence_pattern: string;
  recurrence_interval: number;
  recurrence_end_date: string;
  recurrence_count: number | null;
}

const STORAGE_KEY = "glee-event-editor-data";

export const EventEditor: React.FC<EventEditorProps> = ({
  event,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    start_time: "",
    end_time: "",
    location_name: "",
    location_map_url: "",
    feature_image_url: "",
    short_description: "",
    full_description: "",
    event_host_name: "",
    event_host_contact: "",
    event_types: [] as string[],
    is_private: false,
    is_public: true,
    allow_rsvp: true,
    allow_reminders: true,
    allow_ics_download: true,
    allow_google_map_link: true,
  });

  const [recurrenceData, setRecurrenceData] = useState<RecurrentEventData>({
    is_recurring: false,
    recurrence_pattern: 'weekly',
    recurrence_interval: 1,
    recurrence_end_date: '',
    recurrence_count: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [assignmentsChanged, setAssignmentsChanged] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        start_time: event.start_time
          ? format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm")
          : "",
        end_time: event.end_time
          ? format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm")
          : "",
        location_name: event.location_name || "",
        location_map_url: event.location_map_url || "",
        feature_image_url: event.feature_image_url || "",
        short_description: event.short_description || "",
        full_description: event.full_description || "",
        event_host_name: event.event_host_name || "",
        event_host_contact: event.event_host_contact || "",
        event_types:
          event.event_types || (event.event_type ? [event.event_type] : []),
        is_private: event.is_private || false,
        is_public: event.is_public !== undefined ? event.is_public : true,
        allow_rsvp: event.allow_rsvp !== undefined ? event.allow_rsvp : true,
        allow_reminders:
          event.allow_reminders !== undefined ? event.allow_reminders : true,
        allow_ics_download:
          event.allow_ics_download !== undefined
            ? event.allow_ics_download
            : true,
        allow_google_map_link:
          event.allow_google_map_link !== undefined
            ? event.allow_google_map_link
            : true,
      });

      // Load recurrence data if it exists (from any additional fields in the event)
      setRecurrenceData({
        is_recurring: (event as any).is_recurring || false,
        recurrence_pattern: (event as any).recurrence_pattern || 'weekly',
        recurrence_interval: (event as any).recurrence_interval || 1,
        recurrence_end_date: (event as any).recurrence_end_date 
          ? format(new Date((event as any).recurrence_end_date), "yyyy-MM-dd")
          : '',
        recurrence_count: (event as any).recurrence_count || null,
      });
    } else {
      // Load from localStorage or reset
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.formData) {
            setFormData(parsed.formData);
          }
          if (parsed.recurrenceData) {
            setRecurrenceData(parsed.recurrenceData);
          }
        } catch (error) {
          console.error("Error loading saved data:", error);
        }
      } else {
        resetForm();
      }
    }
  }, [event, isOpen]);

  // Save to localStorage whenever form data changes (but only when creating)
  useEffect(() => {
    if (!event && isOpen) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isCreating: true,
          formData,
          recurrenceData,
        }),
      );
    }
  }, [formData, recurrenceData, event, isOpen]);

  const resetForm = () => {
    setFormData({
      title: "",
      start_time: "",
      end_time: "",
      location_name: "",
      location_map_url: "",
      feature_image_url: "",
      short_description: "",
      full_description: "",
      event_host_name: "",
      event_host_contact: "",
      event_types: [],
      is_private: false,
      is_public: true,
      allow_rsvp: true,
      allow_reminders: true,
      allow_ics_download: true,
      allow_google_map_link: true,
    });
    setRecurrenceData({
      is_recurring: false,
      recurrence_pattern: 'weekly',
      recurrence_interval: 1,
      recurrence_end_date: '',
      recurrence_count: null,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEventTypesChange = (newTypes: string[]) => {
    setFormData((prev) => ({ ...prev, event_types: newTypes }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, feature_image_url: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in required fields");
      return;
    }

    if (formData.event_types.length === 0) {
      toast.error("Please select at least one event type");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare event data with recurrence fields
      const eventData = {
        ...formData,
        // Add recurrence fields to the event data
        ...(recurrenceData.is_recurring ? {
          is_recurring: recurrenceData.is_recurring,
          recurrence_pattern: recurrenceData.recurrence_pattern,
          recurrence_interval: recurrenceData.recurrence_interval,
          recurrence_end_date: recurrenceData.recurrence_end_date 
            ? new Date(recurrenceData.recurrence_end_date).toISOString()
            : null,
          recurrence_count: recurrenceData.recurrence_count,
          parent_event_id: null, // This is the parent event
        } : {
          is_recurring: false,
          recurrence_pattern: null,
          recurrence_interval: 1,
          recurrence_end_date: null,
          recurrence_count: null,
          parent_event_id: null,
        })
      };

      await onSave(eventData as any);

      // Clear localStorage after successful save
      localStorage.removeItem(STORAGE_KEY);

      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!event) {
      // Save current state when closing during creation
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isCreating: true,
          formData,
          recurrenceData,
        }),
      );
    }
    onClose();
  };

  const handleAssignmentsChange = () => {
    setAssignmentsChanged(true);
  };

  const isPerformanceEvent = formData.event_types.some((type) =>
    ["performance", "concert", "tour_concert"].includes(type),
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {event ? "Edit Event" : "Create New Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Date & Time *</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) =>
                      handleInputChange("start_time", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Date & Time *</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) =>
                      handleInputChange("end_time", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Event Type Selector */}
              <EventTypeSelector
                selectedTypes={formData.event_types}
                onTypesChange={handleEventTypesChange}
                required={true}
              />

              <div>
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) =>
                    handleInputChange("short_description", e.target.value)
                  }
                  placeholder="Brief description for calendar view"
                  rows={2}
                />
              </div>

              {/* Event Image Upload */}
              <EventImageUpload
                currentImageUrl={formData.feature_image_url}
                onImageChange={handleImageChange}
              />
            </CardContent>
          </Card>

          {/* Recurrence Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Repeat className="h-5 w-5" />
                Recurrence Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecurrenceSettings
                isRecurring={recurrenceData.is_recurring}
                onIsRecurringChange={(value) => 
                  setRecurrenceData(prev => ({ ...prev, is_recurring: value }))
                }
                pattern={recurrenceData.recurrence_pattern}
                onPatternChange={(value) => 
                  setRecurrenceData(prev => ({ ...prev, recurrence_pattern: value }))
                }
                interval={recurrenceData.recurrence_interval}
                onIntervalChange={(value) => 
                  setRecurrenceData(prev => ({ ...prev, recurrence_interval: value }))
                }
                endDate={recurrenceData.recurrence_end_date}
                onEndDateChange={(value) => 
                  setRecurrenceData(prev => ({ ...prev, recurrence_end_date: value }))
                }
                count={recurrenceData.recurrence_count}
                onCountChange={(value) => 
                  setRecurrenceData(prev => ({ ...prev, recurrence_count: value }))
                }
              />
            </CardContent>
          </Card>

          {/* Location & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location_name">Location</Label>
                  <Input
                    id="location_name"
                    value={formData.location_name}
                    onChange={(e) =>
                      handleInputChange("location_name", e.target.value)
                    }
                    placeholder="Event venue or location"
                  />
                </div>
                <div>
                  <Label htmlFor="location_map_url">Map URL</Label>
                  <Input
                    id="location_map_url"
                    value={formData.location_map_url}
                    onChange={(e) =>
                      handleInputChange("location_map_url", e.target.value)
                    }
                    placeholder="Google Maps or other map link"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event_host_name">Event Host</Label>
                  <Input
                    id="event_host_name"
                    value={formData.event_host_name}
                    onChange={(e) =>
                      handleInputChange("event_host_name", e.target.value)
                    }
                    placeholder="Host organization or person"
                  />
                </div>
                <div>
                  <Label htmlFor="event_host_contact">Host Contact</Label>
                  <Input
                    id="event_host_contact"
                    value={formData.event_host_contact}
                    onChange={(e) =>
                      handleInputChange("event_host_contact", e.target.value)
                    }
                    placeholder="Contact information"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="full_description">Full Description</Label>
                <Textarea
                  id="full_description"
                  value={formData.full_description}
                  onChange={(e) =>
                    handleInputChange("full_description", e.target.value)
                  }
                  placeholder="Detailed event description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Event Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_private"
                      checked={formData.is_private}
                      onCheckedChange={(checked) =>
                        handleInputChange("is_private", checked)
                      }
                    />
                    <Label htmlFor="is_private">Private Event</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_public"
                      checked={formData.is_public}
                      onCheckedChange={(checked) =>
                        handleInputChange("is_public", checked)
                      }
                    />
                    <Label htmlFor="is_public">Public Event</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_rsvp"
                      checked={formData.allow_rsvp}
                      onCheckedChange={(checked) =>
                        handleInputChange("allow_rsvp", checked)
                      }
                    />
                    <Label htmlFor="allow_rsvp">Allow RSVP</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_reminders"
                      checked={formData.allow_reminders}
                      onCheckedChange={(checked) =>
                        handleInputChange("allow_reminders", checked)
                      }
                    />
                    <Label htmlFor="allow_reminders">Allow Reminders</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_ics_download"
                      checked={formData.allow_ics_download}
                      onCheckedChange={(checked) =>
                        handleInputChange("allow_ics_download", checked)
                      }
                    />
                    <Label htmlFor="allow_ics_download">
                      Allow Calendar Download
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="allow_google_map_link"
                      checked={formData.allow_google_map_link}
                      onCheckedChange={(checked) =>
                        handleInputChange("allow_google_map_link", checked)
                      }
                    />
                    <Label htmlFor="allow_google_map_link">Show Map Link</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Assignments - Only show for existing performance events */}
          {event && isPerformanceEvent && (
            <EventAssignmentManager
              event={event}
              onAssignmentsChange={handleAssignmentsChange}
            />
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : event ? "Update Event" : "Create Event"}
            </Button>
          </div>

          {/* Info about performance assignments for new events */}
          {!event && isPerformanceEvent && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <div className="flex items-start gap-2">
                <Music className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Performance Event</p>
                  <p>
                    After creating this event, you'll be able to assign members
                    to perform and they'll be automatically notified.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info about recurring events */}
          {recurrenceData.is_recurring && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
              <div className="flex items-start gap-2">
                <Repeat className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Recurring Event</p>
                  <p>
                    This will create multiple event instances based on your recurrence settings. 
                    Each instance can be edited individually if needed.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
