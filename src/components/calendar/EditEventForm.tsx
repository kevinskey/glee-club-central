import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { CalendarEvent } from '@/types/calendar';

// Define the prop interface with the updated onUpdateEvent type
interface EditEventFormProps {
  event: CalendarEvent;
  onUpdateEvent: (event: CalendarEvent) => Promise<boolean | void>; // Updated return type
  onCancel: () => void;
}

// Define your form schema
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["concert", "rehearsal", "sectional", "special", "tour"]),
});

export function EditEventForm({ event, onUpdateEvent, onCancel }: EditEventFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      type: event.type,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await onUpdateEvent({
        ...event,
        ...data,
      });
      onCancel(); // Close the form on success
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">Title</label>
        <input
          id="title"
          {...register("title")}
          className={`mt-1 block w-full border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <input
          type="date"
          id="date"
          {...register("date")}
          className={`mt-1 block w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium">Time</label>
        <input
          type="time"
          id="time"
          {...register("time")}
          className={`mt-1 block w-full border ${errors.time ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium">Location</label>
        <input
          id="location"
          {...register("location")}
          className={`mt-1 block w-full border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">Description</label>
        <textarea
          id="description"
          {...register("description")}
          className={`mt-1 block w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium">Event Type</label>
        <select
          id="type"
          {...register("type")}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="concert">Concert</option>
          <option value="rehearsal">Rehearsal</option>
          <option value="sectional">Sectional</option>
          <option value="special">Special Event</option>
          <option value="tour">Tour</option>
        </select>
      </div>

      <div className="flex justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" className="ml-2">Update Event</Button>
      </div>
    </form>
  );
}
