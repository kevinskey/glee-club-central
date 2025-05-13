import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, Save, FileText, Clock, Bus, Phone, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { EventImageUpload } from "@/components/calendar/EventImageUpload";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the schema for the form
const eventFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  date: z.date({ required_error: "Event date is required" }),
  description: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  archivalNotes: z.string().optional(),
  
  // Times
  callTime: z.string().optional(),
  wakeUpTime: z.string().optional(),
  departureTime: z.string().optional(),
  performanceTime: z.string().optional(),
  
  // Contact & Transportation
  contactName: z.string().optional(),
  contactEmail: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  transportationCompany: z.string().optional(),
  transportationDetails: z.string().optional(),
  
  // Contract
  contractStatus: z.enum(["draft", "sent", "signed", "completed", "none"]).default("none"),
  contractNotes: z.string().optional(),
  
  // Image
  image_url: z.string().optional().nullable(),
  
  // Additional required fields to match EventFormValues in EventFormFields
  time: z.string().default(""),
  type: z.enum(["rehearsal", "concert", "sectional", "special"]).default("concert"),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => Promise<void>;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
}

export function EventForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = "create"
}: EventFormProps) {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(defaultValues?.image_url || null);
  const [activeTab, setActiveTab] = useState("details");

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: defaultValues?.title || "",
      date: defaultValues?.date || new Date(),
      description: defaultValues?.description || "",
      location: defaultValues?.location || "",
      archivalNotes: defaultValues?.archivalNotes || "",
      callTime: defaultValues?.callTime || "",
      wakeUpTime: defaultValues?.wakeUpTime || "",
      departureTime: defaultValues?.departureTime || "",
      performanceTime: defaultValues?.performanceTime || "",
      contactName: defaultValues?.contactName || "",
      contactEmail: defaultValues?.contactEmail || "",
      contactPhone: defaultValues?.contactPhone || "",
      transportationCompany: defaultValues?.transportationCompany || "",
      transportationDetails: defaultValues?.transportationDetails || "",
      contractStatus: defaultValues?.contractStatus || "none",
      contractNotes: defaultValues?.contractNotes || "",
      image_url: defaultValues?.image_url || null,
      // Add the missing properties
      time: defaultValues?.performanceTime || "",
      type: "concert",
    },
  });

  const handleSubmit = async (values: EventFormValues) => {
    try {
      await onSubmit(values);
      toast.success(`Event ${mode === "create" ? "created" : "updated"} successfully`);
    } catch (error) {
      console.error("Error submitting event form:", error);
      toast.error("Failed to save event. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="details">Basic Details</TabsTrigger>
                <TabsTrigger value="times">Times</TabsTrigger>
                <TabsTrigger value="contact">Contact & Travel</TabsTrigger>
                <TabsTrigger value="contract">Contract</TabsTrigger>
              </TabsList>
              
              {/* Basic Details Tab */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Event Date*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
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

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Location*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter event location" {...field} />
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
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a description for the event" 
                          className="min-h-[120px] resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="archivalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Archival Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter notes for archival purposes" 
                          className="min-h-[100px] resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              {/* Times Tab */}
              <TabsContent value="times" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="callTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Call Time
                            </FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="performanceTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Performance Time
                            </FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="wakeUpTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Wake Up Time
                            </FormLabel>
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
                            <FormLabel className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              Departure Time
                            </FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contact & Travel Tab */}
              <TabsContent value="contact" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium text-sm mb-3">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contactName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              Contact Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter contact name" {...field} />
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
                            <FormLabel className="flex items-center">
                              <Mail className="mr-2 h-4 w-4" />
                              Contact Email
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="Enter contact email" 
                                {...field} 
                                value={field.value || ''}
                              />
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
                            <FormLabel className="flex items-center">
                              <Phone className="mr-2 h-4 w-4" />
                              Contact Phone
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter contact phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-medium text-sm mb-3">Transportation</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="transportationCompany"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <Bus className="mr-2 h-4 w-4" />
                              Transportation Company
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter transportation company" {...field} />
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
                            <FormLabel className="flex items-center">
                              <Bus className="mr-2 h-4 w-4" />
                              Transportation Details
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter transportation details" 
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Contract Tab */}
              <TabsContent value="contract" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="contractStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Contract Status
                              </FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                  {...field}
                                >
                                  <option value="none">No Contract</option>
                                  <option value="draft">Draft</option>
                                  <option value="sent">Sent</option>
                                  <option value="signed">Signed</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="contractNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              Contract Notes
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter notes about the contract" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-center pt-4">
                        <Button type="button" variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Contract
                        </Button>
                      </div>
                      
                      <div className="flex justify-center pt-2">
                        <Button type="button" variant="secondary">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Contract to Host
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right side - Image upload */}
          <div className="w-full md:w-1/3">
            <Card className="h-full">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4 text-center">Event Image</h3>
                <EventImageUpload
                  form={form}
                  isUploading={isSubmitting}
                  selectedImage={selectedImage}
                  setSelectedImage={setSelectedImage}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/events")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Event
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
