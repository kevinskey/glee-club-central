import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCalendarStore } from '@/hooks/useCalendarStore';
import { EventType } from '@/types/calendar';
import { MobileFitCheck } from './MobileFitCheck';
import { MobileFitCheckResult } from '@/utils/calendarMobileUtils';
import { Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";

export interface AddEventFormProps {
  defaultValues?: any;
  onCancel: () => void;
  onSave: (formValues: any) => Promise<void>;
  initialDate?: Date | null;
}

export function AddEventForm({ defaultValues, onCancel, onSave, initialDate }: AddEventFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<DateRange | undefined>(defaultValues?.start ? {
    from: new Date(defaultValues?.start),
    to: new Date(defaultValues?.end)
  } : initialDate ? { from: initialDate, to: initialDate } : undefined);
  const [isAllDay, setIsAllDay] = useState(defaultValues?.allDay || false);
  const [mobileFitResult, setMobileFitResult] = useState<MobileFitCheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(defaultValues?.image_url || '');
  const [uploading, setUploading] = useState(false);
  const { user, profile } = useAuth();

  const form = useForm({
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      location: defaultValues?.location || "",
      type: defaultValues?.type || "event",
      allDay: defaultValues?.allDay || false,
      image_url: defaultValues?.image_url || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // Set initial date range if defaultValues are provided
    if (defaultValues?.start && defaultValues?.end) {
      setDate({
        from: new Date(defaultValues.start),
        to: new Date(defaultValues.end),
      });
    } else if (initialDate) {
      setDate({
        from: initialDate,
        to: initialDate
      });
    }
  }, [defaultValues, initialDate]);

  useEffect(() => {
    // Set initial allDay state if defaultValues are provided
    if (defaultValues?.allDay !== undefined) {
      setIsAllDay(defaultValues.allDay);
    }
  }, [defaultValues]);

  function onSubmit(values: any) {
    setIsSubmitting(true);
    
    // Validate that a date range is selected
    if (!date?.from || !date?.to) {
      toast({
        title: "Error",
        description: "Please select a date range",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Get user ID from user or profile
    const userId = user?.id || profile?.id;
    
    // Check if user ID is available
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create events",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const newEvent = {
      id: defaultValues?.id || Math.random().toString(36).substring(2),
      title: values.title,
      start: date.from,
      end: date.to,
      description: values.description,
      location: values.location,
      type: values.type as EventType,
      allDay: isAllDay,
      image_url: imageUrl,
      user_id: userId,
    };

    onSave(newEvent)
      .then(() => {
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Error saving event:", error);
        toast({
          title: "Error",
          description: "Failed to save event",
          variant: "destructive",
        });
        setIsSubmitting(false);
      });
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `Image must be smaller than 5MB`,
          variant: "destructive",
        });
        return;
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `lovable-uploads/${fileName}`;

      // Upload file to Supabase Storage (event-images bucket)
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicURL } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      if (!publicURL) throw new Error("Failed to get public URL");

      setImageUrl(publicURL.publicUrl);
      form.setValue("image_url", publicURL.publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Event title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write a description for your event"
                  className="resize-none"
                  {...field}
                />
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
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="rehearsal">Rehearsal</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allDay"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>All Day</FormLabel>
                  <FormDescription>
                    Set the event to be all day.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={isAllDay}
                    onCheckedChange={(checked) => {
                      setIsAllDay(checked);
                      field.onChange(checked);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col">
          <FormLabel>Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid gap-2">
          <FormLabel htmlFor="image">Image Upload</FormLabel>
          <FormDescription>Upload an image for the event (max 5MB)</FormDescription>
          <Input
            id="image"
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleImageUpload(e.target.files[0]);
              }
            }}
          />
          {uploading && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          )}
          {imageUrl ? (
            <div className="relative w-48 h-32 mt-2">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="object-cover rounded-md w-full h-full"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm"
                onClick={() => {
                  setImageUrl('');
                  form.setValue("image_url", "");
                }}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}
        </div>

        <MobileFitCheck 
          title={form.getValues("title")}
          description={form.getValues("description")}
          location={form.getValues("location")}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {defaultValues ? "Update Event" : "Add Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
