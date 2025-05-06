import React, { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useLoadScript } from "@react-google-maps/api";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
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

// Common time options for events
const timeOptions = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"
];

// Common time range options
const timeRangeOptions = [
  "8:00 AM - 10:00 AM", "9:00 AM - 11:00 AM", "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM", "1:00 PM - 3:00 PM", "2:00 PM - 4:00 PM",
  "3:00 PM - 5:00 PM", "4:00 PM - 6:00 PM", "5:00 PM - 7:00 PM",
  "6:00 PM - 8:00 PM", "7:00 PM - 9:00 PM", "8:00 PM - 10:00 PM"
];

type FormValues = z.infer<typeof formSchema>;

interface AddEventFormProps {
  onAddEvent: (event: FormValues) => void;
  onCancel: () => void;
}

export function AddEventForm({ onAddEvent, onCancel }: AddEventFormProps) {
  const [locationInputFocused, setLocationInputFocused] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const { user } = useAuth();

  // Load Google Maps Places API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAEzAWJoMrD9BKIirYD_2sEOWhb4UffL2s", // Replace with your actual API key
    libraries: ["places"] as any,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      time: "",
      location: "",
      description: "",
      type: "concert",
    },
  });

  // Initialize Google Maps Places Autocomplete
  useEffect(() => {
    if (isLoaded && !loadError && locationInputRef.current && locationInputFocused) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        { types: ["establishment", "geocode"] }
      );

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.formatted_address) {
          form.setValue("location", place.formatted_address);
        }
      });

      return () => {
        if (autocompleteRef.current) {
          google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }
  }, [isLoaded, loadError, locationInputFocused, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to save events");
      return;
    }
    
    // Handle image upload if there's a selected image
    let imageUrl = values.image_url;
    
    if (selectedImage) {
      try {
        const fileName = `${Date.now()}-${selectedImage.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(fileName, selectedImage);
          
        if (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error('Failed to upload image');
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
    
    form.reset();
    setSelectedImage(null);
    setImagePreview(null);
  }

  const handleSelectTime = (time: string) => {
    form.setValue("time", time);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="Fall Showcase" {...field} className="bg-white dark:bg-gray-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          "w-full pl-3 text-left font-normal bg-white dark:bg-gray-700",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Clock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Input
                          placeholder="Select or type a time"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="pl-9 pr-10 bg-white dark:bg-gray-700"
                          type="text"
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800">
                        <div className="p-2">
                          <p className="mb-2 text-sm font-medium">Specific Times</p>
                          <div className="grid grid-cols-2 gap-1">
                            {timeOptions.map((time) => (
                              <DropdownMenuItem 
                                key={time} 
                                onClick={() => handleSelectTime(time)}
                                className="cursor-pointer"
                              >
                                {time}
                              </DropdownMenuItem>
                            ))}
                          </div>
                          <div className="mt-3 border-t pt-2">
                            <p className="mb-2 text-sm font-medium">Time Ranges</p>
                            <div className="grid grid-cols-1 gap-1">
                              {timeRangeOptions.map((timeRange) => (
                                <DropdownMenuItem 
                                  key={timeRange} 
                                  onClick={() => handleSelectTime(timeRange)}
                                  className="cursor-pointer"
                                >
                                  {timeRange}
                                </DropdownMenuItem>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="flex items-center relative">
                  <MapPin className="absolute left-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter location" 
                    {...field}
                    className="pl-9 bg-white dark:bg-gray-700"
                    ref={locationInputRef}
                    onFocus={() => setLocationInputFocused(true)}
                    onBlur={() => setLocationInputFocused(false)}
                  />
                </div>
              </FormControl>
              {loadError && (
                <p className="text-sm text-red-500">Error loading Maps API. Using regular input.</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-gray-700">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-gray-800">
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="rehearsal">Rehearsal</SelectItem>
                  <SelectItem value="tour">Tour</SelectItem>
                  <SelectItem value="special">Special Event</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This determines how the event will be displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Image (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="bg-white dark:bg-gray-700"
                  />
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-h-40 object-cover rounded-md" 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-red-500 hover:text-red-700"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload an image for this event (optional)
              </FormDescription>
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
                  placeholder="Event details and additional information"
                  className="resize-none bg-white dark:bg-gray-700"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="bg-white dark:bg-gray-700">
            Cancel
          </Button>
          <Button type="submit" className="bg-glee-purple hover:bg-glee-purple/90">
            Save Event
          </Button>
        </div>
      </form>
    </Form>
  );
}
