
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields, EventFormValues } from "./EventFormFields";
import { EventImageUpload } from "./EventImageUpload";
import { EventType } from "@/hooks/useCalendarEvents";
import { MobileFitCheck } from "./MobileFitCheck";
import { checkEventMobileFit } from "@/utils/mobileUtils";

export const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  location: z.string().min(1, { message: "Please enter a location" }),
  description: z.string().optional(),
  type: z.enum(["concert", "rehearsal", "sectional", "special"], {
    required_error: "Please select an event type",
  }),
  image_url: z.string().optional().nullable(),
});

interface AddEventFormProps {
  onAddEvent: (event: EventFormValues & { start: Date, end: Date }) => void;
  onCancel: () => void;
  initialDate?: Date;
}

export function AddEventForm({ onAddEvent, onCancel, initialDate }: AddEventFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mobileFitIssues, setMobileFitIssues] = useState<{ fits: boolean; issues: string[]; suggestions: string[] } | null>(null);
  const { user } = useAuth();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: initialDate || new Date(),
      time: "",
      location: "",
      description: "",
      type: "concert" as EventType,
      image_url: null,
    },
  });

  // Update the form's date value when initialDate prop changes
  useEffect(() => {
    if (initialDate) {
      form.setValue('date', initialDate);
    }
  }, [initialDate, form]);

  // Watch form fields to check mobile fit
  const title = form.watch('title');
  const location = form.watch('location');
  const description = form.watch('description');

  async function onSubmit(values: EventFormValues) {
    if (!user) {
      toast.error("You must be logged in to save events");
      return;
    }
    
    // Check mobile fit before saving
    const mobileFitCheck = checkEventMobileFit(values.title, values.location, values.description);
    
    // If there are mobile fit issues, show a warning but allow continuing
    if (!mobileFitCheck.fits) {
      setMobileFitIssues(mobileFitCheck);
      
      // Show toast with warning but continue with saving
      toast.warning("Event may not display optimally on mobile devices", {
        description: "You can continue saving or go back and make adjustments.",
        action: {
          label: "View Details",
          onClick: () => setMobileFitIssues(mobileFitCheck)
        }
      });
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
      
      // Add the image URL and required start/end dates to the event data
      const enhancedValues = {
        ...values,
        image_url: imageUrl,
        start: values.date,  // Set start date from form date
        end: values.date     // Set end date (same as start for simplicity)
      };
      
      // Pass the enhanced values to the onAddEvent handler
      onAddEvent(enhancedValues);
      
      // Reset form and state
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
      setMobileFitIssues(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving the event");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-1">
        <EventFormFields form={form} />

        <EventImageUpload 
          form={form}
          isUploading={isUploading}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />

        {mobileFitIssues && !mobileFitIssues.fits && (
          <MobileFitCheck 
            title={title}
            location={location}
            description={description}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-white dark:bg-gray-700 text-sm px-3 py-1 h-8" disabled={isUploading}>
            Cancel
          </Button>
          <Button type="submit" className="bg-glee-purple hover:bg-glee-purple/90 text-sm px-3 py-1 h-8" disabled={isUploading}>
            {isUploading ? (
              <>
                <span className="mr-2">Uploading...</span>
                <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              </>
            ) : (
              'Save Event'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
