
import React, { useRef, useState, useEffect } from "react";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
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
import { useLoadScript } from "@react-google-maps/api";
import { UseFormReturn } from "react-hook-form";
import { EventFormValues } from "./AddEventForm";

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

interface EventFormFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export function EventFormFields({ form }: EventFormFieldsProps) {
  const [locationInputFocused, setLocationInputFocused] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps Places API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAEzAWJoMrD9BKIirYD_2sEOWhb4UffL2s",
    libraries: ["places"] as any,
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

  const handleSelectTime = (time: string) => {
    form.setValue("time", time);
  };

  return (
    <>
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
    </>
  );
}
