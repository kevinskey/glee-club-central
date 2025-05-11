
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields } from "./EventFormFields";
import { EventImageUpload } from "./EventImageUpload";
import { CalendarEvent, EventType } from "@/hooks/useCalendarEvents";
import { formSchema, EventFormValues } from "./AddEventForm";

interface EditEventFormProps {
  event: CalendarEvent;
  onUpdateEvent: (event: CalendarEvent) => Promise<boolean>;
  onCancel: () => void;
}

export function EditEventForm({ event, onUpdateEvent, onCancel }: EditEventFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(event.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title,
      date: event.start,
      time: event.time || "",
      location: event.location,
      description: event.description || "",
      type: event.type as EventType, // Ensure proper type casting
      image_url: event.image_url || null,
    },
  });

  async function onSubmit(values: EventFormValues) {
    if (!user) {
      toast.error("You must be logged in to update events");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Handle image upload if there's a selected image
      let imageUrl = values.image_url;
      
      if (selectedImage) {
        try {
          // Create a unique filename with timestamp and original name
          const fileExt = selectedImage.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          // Upload the file to Supabase storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('event-images')
            .upload(fileName, selectedImage);
            
          if (uploadError) {
            console.error('Image upload error:', uploadError);
            toast.error('Failed to upload image: ' + uploadError.message);
            return;
          }
          
          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('event-images')
            .getPublicUrl(fileName);
            
          imageUrl = publicUrl;
        } catch (err) {
          console.error('Error uploading image:', err);
          toast.error('Failed to upload image');
          return;
        }
      }
      
      // Update the event with the form values and image URL
      const updated = await onUpdateEvent({
        ...event,
        title: values.title,
        start: values.date,
        end: values.date,
        date: values.date, // Keep compatibility with date field
        time: values.time,
        location: values.location,
        description: values.description || "",
        type: values.type as EventType, // Ensure proper type casting
        image_url: imageUrl
      });
      
      if (updated) {
        toast.success("Event updated successfully");
        onCancel();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while updating the event");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EventFormFields form={form} />

        <EventImageUpload 
          form={form}
          isUploading={isUploading}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-white dark:bg-gray-700" disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-glee-purple hover:bg-glee-purple/90" disabled={isUploading}>
            {isUploading ? (
              <>
                <span className="mr-2">Updating...</span>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              </>
            ) : (
              'Update Event'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
