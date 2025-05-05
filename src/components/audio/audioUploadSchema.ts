
import * as z from "zod";

export const audioUploadSchema = z.object({
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

export type AudioUploadFormValues = z.infer<typeof audioUploadSchema>;
