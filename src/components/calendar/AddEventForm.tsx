
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EventFormFields } from "./EventFormFields";
import { EventImageUpload } from "./EventImageUpload";

export const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  location: z.string().min(1, { message: "Please enter a location" }),
  description: z.string().optional(),
  type: z.enum(["concert", "rehearsal", "tour", "special"], {
    required_error: "Please select an event type",
  }),
  image_url: z.string().optional().nullable(),
});

export type EventFormValues = z.infer<typeof formSchema>;

interface AddEventFormProps {
  onAddEvent: (event: EventFormValues) => void;
  onCancel: () => void;
}

export function AddEventForm({ onAddEvent, onCancel }: AddEventFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      time: "",
      location: "",
      description: "",
      type: "concert",
    },
  });

  async function onSubmit(values: EventFormValues) {
    if (!user) {
      toast.error("You must be logged in to save events");
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
      
      // Add the image URL to the event data
      onAddEvent({
        ...values, 
        image_url: imageUrl
      });
      
      // Reset form and state
      form.reset();
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving the event");
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
                <span className="mr-2">Uploading...</span>
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
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
