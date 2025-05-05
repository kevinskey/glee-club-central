
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { AudioCategorySelector } from "./AudioCategorySelector";

interface AudioUploadFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isUploading: boolean;
}

export function AudioUploadForm({ form, onSubmit, isUploading }: AudioUploadFormProps) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <AudioCategorySelector form={form} />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter a title" {...field} />
              </FormControl>
              <FormDescription>
                The name of the audio file or recording.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Additional information about this audio file.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="audioFile"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Audio File</FormLabel>
              <FormControl>
                <div className="grid w-full items-center gap-1.5">
                  <Input
                    id="audio-upload"
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp3,audio/ogg"
                    className="cursor-pointer"
                    onChange={(e) =>
                      onChange(e.target.files ? e.target.files[0] : null)
                    }
                    {...rest}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Supported formats: MP3, WAV, OGG. Max size: 20MB.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" /> Upload Audio
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
