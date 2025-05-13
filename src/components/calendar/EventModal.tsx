
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CalendarEvent, EventType } from "@/types/calendar";
import { EventImageUpload } from "@/components/calendar/EventImageUpload";
import { uploadEventImage } from "@/utils/supabase/eventImageUpload";
import { toast } from "sonner";

// Create a schema for form validation
const formSchema = z.object({
  title: z.string().min(2, "Title must have at least 2 characters"),
  date: z.date(),
  startTime: z.string().default("12:00"),
  endTime: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  type: z.string(),
  allDay: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

interface EventModalProps {
  onClose: () => void;
  onSave: (event: any) => Promise<void>;
  initialDate: Date | null;
  defaultValues?: Partial<CalendarEvent>;
  mode?: "create" | "edit";
}

export const EventModal = ({
  onClose,
  onSave,
  initialDate,
  defaultValues,
  mode = "create",
}: EventModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    defaultValues?.image_url || null
  );
  const isEditMode = mode === "edit";

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      date: defaultValues?.start ? new Date(defaultValues.start) : initialDate || new Date(),
      startTime: defaultValues?.start
        ? format(new Date(defaultValues.start), "HH:mm")
        : "12:00",
      endTime: defaultValues?.end && defaultValues.end !== defaultValues.start
        ? format(new Date(defaultValues.end), "HH:mm")
        : "",
      location: defaultValues?.location || "",
      description: defaultValues?.description || "",
      type: defaultValues?.type || "concert",
      allDay: defaultValues?.allDay || false,
      imageUrl: defaultValues?.image_url || "",
    },
  });

  // Update form values when defaultValues change
  useEffect(() => {
    if (defaultValues || initialDate) {
      form.reset({
        title: defaultValues?.title || "",
        date: defaultValues?.start ? new Date(defaultValues.start) : initialDate || new Date(),
        startTime: defaultValues?.start
          ? format(new Date(defaultValues.start), "HH:mm")
          : "12:00",
        endTime: defaultValues?.end && defaultValues.end !== defaultValues.start
          ? format(new Date(defaultValues.end), "HH:mm")
          : "",
        location: defaultValues?.location || "",
        description: defaultValues?.description || "",
        type: defaultValues?.type || "concert",
        allDay: defaultValues?.allDay || false,
        imageUrl: defaultValues?.image_url || "",
      });
    }
  }, [defaultValues, initialDate, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("EventModal onSubmit with values:", values);
      setIsSubmitting(true);

      // Handle image upload if there's a selected image
      let imageUrl = values.imageUrl;
      
      if (selectedImage) {
        try {
          // Upload the image to the media library
          imageUrl = await uploadEventImage(selectedImage, values.title);
          
          if (!imageUrl) {
            toast.error('Failed to upload image');
            setIsSubmitting(false);
            return;
          }
        } catch (err) {
          console.error('Error uploading image:', err);
          toast.error('Failed to upload image');
          setIsSubmitting(false);
          return;
        }
      }

      // Create event start and end dates
      const dateString = format(values.date, "yyyy-MM-dd");
      const defaultTime = "12:00:00"; // Default time if none is provided
      const timeValue = values.startTime || defaultTime;
      
      let startDate, endDate;

      if (values.allDay) {
        startDate = new Date(`${dateString}T00:00:00`);
        endDate = new Date(`${dateString}T23:59:59`);
      } else {
        startDate = new Date(`${dateString}T${timeValue}`);
        
        endDate = values.endTime
          ? new Date(`${dateString}T${values.endTime}:00`)
          : new Date(startDate.getTime() + 3600000); // Add 1 hour by default
      }

      // Prepare event data
      const eventData = {
        id: defaultValues?.id,
        title: values.title,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        date: dateString,
        time: timeValue,
        location: values.location || "TBD",
        description: values.description || "",
        type: values.type as EventType,
        allDay: values.allDay,
        image_url: imageUrl,
      };

      console.log("Calling onSave with eventData:", eventData);

      // Save the event
      await onSave(eventData);
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error("Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventTypes = [
    { value: "concert", label: "Concert" },
    { value: "rehearsal", label: "Rehearsal" },
    { value: "sectional", label: "Sectional" },
    { value: "meeting", label: "Meeting" },
    { value: "tour", label: "Tour" },
    { value: "special", label: "Special Event" },
    { value: "other", label: "Other" },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pb-16">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <Label htmlFor="all-day">All day event</Label>
                </FormItem>
              )}
            />
          </div>

          {!form.watch("allDay") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 opacity-50" />
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Start Time"
                          {...field}
                          defaultValue="12:00"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 opacity-50" />
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="End Time"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter event description"
                    className="min-h-24"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Add the image upload component */}
          <EventImageUpload
            form={form}
            isUploading={isSubmitting}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />

          <div className="flex justify-end space-x-2 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </>
              ) : (
                <>{isEditMode ? "Update Event" : "Save Event"}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
