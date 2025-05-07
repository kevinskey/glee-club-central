
import { z } from "zod";

export const userFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.string(),
  status: z.string(),
  voice_part: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  password: z.string().optional(),
  section_id: z.string().optional().nullable(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
