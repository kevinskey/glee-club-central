
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarEvent, EventType } from "@/types/calendar";
import { format, parseISO } from "date-fns";

interface ViewEventModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
  userCanEdit: boolean;
}

const eventSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  type: z.enum(["rehearsal", "concert", "sectional", "special"]),
  startDate: z.string().min(1, { message: "Start date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  location: z.string().optional(),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export function ViewEventModal({ event, onClose, onUpdate, onDelete, userCanEdit }: ViewEventModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Parse event dates
  const startDate = parseISO(event.start);
  const endDate = parseISO(event.end);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      type: event.type,
      startDate: format(startDate, "yyyy-MM-dd"),
      startTime: format(startDate, "HH:mm"),
      endDate: format(endDate, "yyyy-MM-dd"),
      endTime: format(endDate, "HH:mm"),
      location: event.location || "",
      description: event.description || "",
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const start = `${data.startDate}T${data.startTime}`;
    const end = `${data.endDate}T${data.endTime}`;

    onUpdate({
      ...event,
      title: data.title,
      type: data.type as EventType,
      start,
      end,
      location: data.location,
      description: data.description,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset({
      title: event.title,
      type: event.type,
      startDate: format(startDate, "yyyy-MM-dd"),
      startTime: format(startDate, "HH:mm"),
      endDate: format(endDate, "yyyy-MM-dd"),
      endTime: format(endDate, "HH:mm"),
      location: event.location || "",
      description: event.description || "",
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Event" : "Event Details"}</DialogTitle>
        {!isEditing && <DialogDescription>
          {format(startDate, "EEEE, MMMM d, yyyy")}
        </DialogDescription>}
      </DialogHeader>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rehearsal">Rehearsal</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="sectional">Sectional</SelectItem>
                      <SelectItem value="special">Special Event</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">{event.title}</h3>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ 
                  backgroundColor: event.type === 'rehearsal' ? '#3b82f6' :
                                event.type === 'concert' ? '#f97316' :
                                event.type === 'sectional' ? '#22c55e' :
                                '#a855f7'
                }}
              />
              <span className="text-sm capitalize">{event.type}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Time</p>
            <p className="text-sm">
              {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
            </p>
          </div>
          
          {event.location && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm">{event.location}</p>
            </div>
          )}
          
          {event.description && (
            <div className="space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
          
          {userCanEdit && (
            <div className="flex justify-end gap-2 pt-4">
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this event? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(event.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleEdit}>Edit</Button>
            </div>
          )}
          
          {!userCanEdit && (
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
