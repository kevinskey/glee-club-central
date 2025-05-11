
import React from "react";
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
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarEvent, EventType } from "@/types/calendar";
import { parseISO, format, addHours } from "date-fns";

interface EventModalProps {
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id" | "created_by">) => void;
  initialDate: Date | null;
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

export function EventModal({ onClose, onSave, initialDate }: EventModalProps) {
  const defaultStartDate = initialDate || new Date();
  const defaultEndDate = addHours(defaultStartDate, 1);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      type: "rehearsal",
      startDate: format(defaultStartDate, "yyyy-MM-dd"),
      startTime: format(defaultStartDate, "HH:mm"),
      endDate: format(defaultEndDate, "yyyy-MM-dd"),
      endTime: format(defaultEndDate, "HH:mm"),
      location: "",
      description: "",
    },
  });

  const onSubmit = (data: EventFormValues) => {
    const start = `${data.startDate}T${data.startTime}`;
    const end = `${data.endDate}T${data.endTime}`;

    onSave({
      title: data.title,
      type: data.type as EventType,
      start,
      end,
      location: data.location,
      description: data.description,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add New Event</DialogTitle>
      </DialogHeader>
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
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </div>
        </form>
      </Form>
    </>
  );
}
