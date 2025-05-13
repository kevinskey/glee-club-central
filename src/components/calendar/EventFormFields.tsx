
import React, { useState } from "react";
import { useFormContext, UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MobileFitCheck } from "./MobileFitCheck";
import { EventType } from "@/types/calendar";

// Define a proper type for the form values to exactly match EventFormValues in EventForm
export interface EventFormValues {
  title: string;
  date: Date;
  time: string;
  location: string;
  description: string;
  type: EventType;
  image_url: string | null;
  
  // Additional fields to match EventForm
  archivalNotes?: string;
  callTime?: string;
  wakeUpTime?: string;
  departureTime?: string;
  performanceTime?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  transportationCompany?: string;
  transportationDetails?: string;
  contractStatus?: "draft" | "sent" | "signed" | "completed" | "none";
  contractNotes?: string;
}

interface EventFormFieldsProps {
  form: UseFormReturn<EventFormValues>;
}

export const EventFormFields = ({ form }: EventFormFieldsProps) => {
  const [showMobileFit, setShowMobileFit] = useState(false);
  const formMethods = useFormContext<EventFormValues>();
  
  // Watch for title, location and description changes to update the mobile fit check
  const title = formMethods.watch('title') || '';
  const location = formMethods.watch('location') || '';
  const description = formMethods.watch('description') || '';

  return (
    <div className="space-y-3">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Event Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter event title" {...field} className="h-9" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-9 pl-3 text-left font-normal text-sm",
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
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="flex-1">
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} className="h-9 text-sm" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Location</FormLabel>
            <FormControl>
              <Input placeholder="Event location" {...field} className="h-9 text-sm" />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Event Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="concert">Concert</SelectItem>
                <SelectItem value="rehearsal">Rehearsal</SelectItem>
                <SelectItem value="sectional">Sectional</SelectItem>
                <SelectItem value="special">Special Event</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Event description"
                className="min-h-[80px] text-sm resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 text-xs"
          onClick={() => setShowMobileFit(!showMobileFit)}
        >
          <Smartphone className="mr-1 h-3 w-3" />
          {showMobileFit ? 'Hide' : 'Check'} mobile fit
        </Button>
        
        {showMobileFit && (
          <MobileFitCheck 
            title={title}
            location={location}
            description={description}
            showPreview={true}
          />
        )}
      </div>
    </div>
  );
};
