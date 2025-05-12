
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ImageIcon, Upload, X } from "lucide-react";
import { EventFormValues } from "./EventFormFields";

interface EventImageUploadProps {
  form: UseFormReturn<EventFormValues>;
  isUploading: boolean;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  imagePreview: string | null;
  setImagePreview: (url: string | null) => void;
}

export function EventImageUpload({
  form,
  isUploading,
  selectedImage,
  setSelectedImage,
  imagePreview,
  setImagePreview,
}: EventImageUploadProps) {
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        return;
      }

      setSelectedImage(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    form.setValue("image_url", null);
  };

  return (
    <FormField
      control={form.control}
      name="image_url"
      render={({ field }) => (
        <FormItem className="mt-1">
          <FormLabel className="text-xs">Event Image (Optional)</FormLabel>
          <FormControl>
            <div className="space-y-1">
              {!imagePreview && !field.value ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2 text-center">
                  <ImageIcon className="h-6 w-6 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    PNG, JPG or GIF (max. 5MB)
                  </p>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="relative h-7 text-xs"
                      disabled={isUploading}
                    >
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                      <Upload className="h-3 w-3 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || field.value || ""}
                    alt="Event image preview"
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
