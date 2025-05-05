
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Music, Upload, ListMusic, AudioLines, FileAudio } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type AudioCategory = "part_tracks" | "recordings" | "my_tracks";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  category: z.enum(['part_tracks', 'recordings', 'my_tracks']),
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
  defaultCategory?: AudioCategory;
}

export function UploadAudioModal({
  open,
  onOpenChange,
  onUploadComplete,
  defaultCategory = "recordings",
}: UploadAudioModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: defaultCategory,
    },
  });

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
    } else {
      // Set the category when the modal opens
      form.setValue("category", defaultCategory);
    }
  }, [open, form, defaultCategory]);

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
        category: data.category,
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

  // Get display name for category
  const getCategoryName = (category: AudioCategory): string => {
    switch (category) {
      case "part_tracks":
        return "Part Tracks";
      case "recordings":
        return "Recordings";
      case "my_tracks":
        return "My Tracks";
    }
  };
  
  // Get description for category
  const getCategoryDescription = (category: AudioCategory): string => {
    switch (category) {
      case "part_tracks":
        return "Individual vocal parts for practice";
      case "recordings":
        return "Full choir recordings and performances";
      case "my_tracks":
        return "Personal recordings and practice files";
    }
  };
  
  // Get icon for category
  const getCategoryIcon = (category: AudioCategory) => {
    switch (category) {
      case "part_tracks":
        return <ListMusic className="h-4 w-4" />;
      case "recordings":
        return <AudioLines className="h-4 w-4" />;
      case "my_tracks":
        return <FileAudio className="h-4 w-4" />; // Changed from Audio to FileAudio
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
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3"
                      >
                        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                          <RadioGroupItem value="part_tracks" id="part_tracks" />
                          <Label htmlFor="part_tracks" className="flex flex-1 items-center gap-2 cursor-pointer">
                            <ListMusic className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Part Tracks</div>
                              <div className="text-xs text-muted-foreground">Individual vocal parts for practice</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                          <RadioGroupItem value="recordings" id="recordings" />
                          <Label htmlFor="recordings" className="flex flex-1 items-center gap-2 cursor-pointer">
                            <AudioLines className="h-4 w-4" />
                            <div>
                              <div className="font-medium">Recordings</div>
                              <div className="text-xs text-muted-foreground">Full choir recordings and performances</div>
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent">
                          <RadioGroupItem value="my_tracks" id="my_tracks" />
                          <Label htmlFor="my_tracks" className="flex flex-1 items-center gap-2 cursor-pointer">
                            <Audio className="h-4 w-4" />
                            <div>
                              <div className="font-medium">My Tracks</div>
                              <div className="text-xs text-muted-foreground">Personal recordings and practice files</div>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
