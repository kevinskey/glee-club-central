
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CalendarEvent } from "@/types/calendar";
import { EventFormFields, EventFormValues } from "./EventFormFields";
import { EventImageUpload } from "./EventImageUpload";
import { MobileFitCheck } from "./MobileFitCheck";
import { checkEventMobileFit } from "@/utils/mobileUtils";
import { toast } from "sonner";

export const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  location: z.string().min(1, { message: "Please enter a location" }),
  description: z.string().optional(),
  type: z.string().min(1, { message: "Please select an event type" }),
  image_url: z.string().optional().nullable(),
});

interface EditEventFormProps {
  event: CalendarEvent;
  onUpdateEvent: (event: CalendarEvent) => Promise<boolean>;
  onCancel: () => void;
}

export function EditEventForm({
  event,
  onUpdateEvent,
  onCancel,
}: EditEventFormProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event.image_url || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileFitIssues, setMobileFitIssues] = useState<{ fits: boolean; issues: string[]; suggestions: string[] } | null>(null);

  // Create form with default values from the event
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title,
      date: new Date(event.date),
      time: event.time || "",
      location: event.location,
      description: event.description || "",
      type: event.type as "rehearsal" | "concert" | "sectional" | "special" | "tour",
      image_url: event.image_url || null,
    },
  });

  // Watch form fields to check mobile fit
  const title = form.watch('title');
  const location = form.watch('location');
  const description = form.watch('description');

  const onSubmit = async (values: EventFormValues) => {
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
    
    setIsSubmitting(true);

    try {
      const updatedEvent: CalendarEvent = {
        id: event.id,
        title: values.title,
        date: values.date,
        start: values.date,
        end: values.date,
        time: values.time,
        location: values.location,
        description: values.description,
        type: values.type,
        image_url: values.image_url,
      };

      const success = await onUpdateEvent(updatedEvent);
      if (success) {
        toast.success("Event updated successfully");
        onCancel();
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EventFormFields form={form} />

        <EventImageUpload
          form={form}
          isUploading={isSubmitting}
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
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-glee-purple hover:bg-glee-purple/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
                <span className="animate-spin">⏳</span>
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
