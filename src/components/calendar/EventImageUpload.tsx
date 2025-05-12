
import React, { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { EventFormValues } from "./EventFormFields";

interface EventImageUploadProps {
  form: UseFormReturn<EventFormValues>;
  isUploading: boolean;
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

export function EventImageUpload({ 
  form, 
  isUploading, 
  selectedImage, 
  setSelectedImage, 
  imagePreview,
  setImagePreview 
}: EventImageUploadProps) {
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
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
                disabled={isUploading}
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
                      field.onChange("");
                    }}
                    disabled={isUploading}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Upload an image for this event (max 5MB)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
