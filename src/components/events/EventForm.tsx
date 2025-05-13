import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EventType } from "@/types/calendar";
import { GoogleMapAutocomplete } from "@/components/calendar/GoogleMapAutocomplete";

// Define form schema
const eventFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  date: z.date({ required_error: "A date is required" }),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["rehearsal", "concert", "sectional", "special", "tour"]),
  image_url: z.string().nullable().optional(),
  archivalNotes: z.string().optional(),
  callTime: z.string().optional(),
  wakeUpTime: z.string().optional(),
  departureTime: z.string().optional(),
  performanceTime: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  transportationCompany: z.string().optional(),
  transportationDetails: z.string().optional(),
  contractStatus: z.enum(["draft", "sent", "signed", "completed", "none"]).optional(),
  contractNotes: z.string().optional(),
});

// Export EventFormValues type for usage in other components
export type EventFormValues = z.infer<typeof eventFormSchema>;

export interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export function EventForm({ 
  defaultValues = {
    title: "",
    date: new Date(),
    time: "",
    location: "",
    description: "",
    type: "concert" as const,
    image_url: null,
  }, 
  onSubmit, 
  isSubmitting = false,
  mode = "create"
}: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  const handleSubmit = (values: EventFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="rehearsal">Rehearsal</SelectItem>
                      <SelectItem value="sectional">Sectional</SelectItem>
                      <SelectItem value="special">Special Event</SelectItem>
                      <SelectItem value="tour">Tour</SelectItem>
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
                  <FormLabel>Date <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
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

            {/* Replace location with Google Maps autocomplete */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <GoogleMapAutocomplete 
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Search for a location"
                    />
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
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Event Details Section */}
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Event Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="performanceTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performance Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="callTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Call Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wakeUpTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wake-up Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departureTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="archivalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archival Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes for archival purposes"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact person" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Transportation & Contract Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Transportation</h3>
            
            <FormField
              control={form.control}
              name="transportationCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportation Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transportationDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transportation Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Details about transportation"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Contract</h3>
            
            <FormField
              control={form.control}
              name="contractStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Contract</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="signed">Signed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Notes about the contract"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : (
              <>{mode === "create" ? "Create Event" : "Update Event"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
