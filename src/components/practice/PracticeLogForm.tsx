
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, Book, MusicIcon, Clock } from "lucide-react";
import { toast } from "sonner";

interface PracticeLogFormProps {
  onSubmit: (minutes: number, category: string, description: string | null, date?: string) => Promise<boolean>;
  defaultValues?: {
    minutes?: number;
    category?: string;
    description?: string;
    date?: string;
  };
  isEditing?: boolean;
  onCancel?: () => void;
}

interface FormValues {
  minutes: number;
  category: string;
  description: string;
  date: string;
}

export function PracticeLogForm({ 
  onSubmit, 
  defaultValues = {}, 
  isEditing = false,
  onCancel
}: PracticeLogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    defaultValues: {
      minutes: defaultValues.minutes || 15,
      category: defaultValues.category || "warmups",
      description: defaultValues.description || "",
      date: defaultValues.date || new Date().toISOString().split("T")[0]
    }
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const success = await onSubmit(
        values.minutes, 
        values.category, 
        values.description || null, 
        values.date
      );
      
      if (success && !isEditing) {
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting practice log:", error);
      toast.error("Failed to save practice log");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "warmups", label: "Warm-ups", icon: <Headphones className="h-4 w-4" /> },
    { value: "sectionals", label: "Sectional Practice", icon: <MusicIcon className="h-4 w-4" /> },
    { value: "full", label: "Full Choir Music", icon: <MusicIcon className="h-4 w-4" /> },
    { value: "sightreading", label: "Sight Reading", icon: <Book className="h-4 w-4" /> },
    { value: "other", label: "Other Practice", icon: <Clock className="h-4 w-4" /> }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minutes Practiced</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Practice Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="What did you work on?"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? "Update Log" : "Log Practice"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
