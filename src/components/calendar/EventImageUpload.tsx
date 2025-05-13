
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ImageIcon, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface EventImageUploadProps {
  form: UseFormReturn<any>;
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
        toast.error("File size exceeds 5MB limit.");
        return;
      }

      // Check file type
      if (!file.type.match('image/(jpeg|jpg|png|gif)')) {
        toast.error("Only JPEG, PNG and GIF images are allowed.");
        return;
      }

      setSelectedImage(file);
      form.setValue("imageUrl", null);

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
    form.setValue("imageUrl", null);
  };

  return (
    <FormField
      control={form.control}
      name="imageUrl"
      render={({ field }) => (
        <FormItem className="mt-1">
          <FormLabel className="text-xs">Event Image (Optional)</FormLabel>
          <FormControl>
            <div className="space-y-1">
              {!imagePreview && !field.value ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                  <ImageIcon className="h-5 w-5 mb-2 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    PNG, JPG or GIF (max. 5MB)
                  </p>
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="relative h-8 text-xs"
                      disabled={isUploading}
                    >
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                      <Upload className="h-3.5 w-3.5 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || field.value || ""}
                    alt="Event image preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
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
