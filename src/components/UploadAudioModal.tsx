
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Music, Upload } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  audioFile: z
    .instanceof(File, { message: "Audio file is required." })
    .refine((file) => file.size <= 20000000, {
      message: "File size should be less than 20MB.",
    })
    .refine(
      (file) => ["audio/mpeg", "audio/wav", "audio/mp3", "audio/ogg"].includes(file.type),
      {
        message: "File must be an audio file (MP3, WAV, or OGG).",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

interface UploadAudioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: () => void;
}

export function UploadAudioModal({
  open,
  onOpenChange,
  onUploadComplete,
}: UploadAudioModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload audio files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const file = data.audioFile;
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage
      let { error: uploadError, data: uploadData } = await supabase.storage
        .from("audio")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL for the file
      const { data: publicUrlData } = supabase.storage
        .from("audio")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL for uploaded file");
      }

      // Save metadata to the database
      const { error: insertError } = await supabase.from("audio_files").insert({
        title: data.title,
        description: data.description || null,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        uploaded_by: user.id,
      });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: "Upload Successful",
        description: "Your audio file has been uploaded.",
      });

      // Close modal and refresh audio files list
      onOpenChange(false);
      onUploadComplete();
    } catch (error: any) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" /> Upload Audio File
          </SheetTitle>
          <SheetDescription>
            Upload audio files for the choir to listen to.
          </SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
