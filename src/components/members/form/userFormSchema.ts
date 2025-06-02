
import { z } from "zod";

export const userFormSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().optional(),
  voice_part: z.string().default(""),
  class_year: z.string().optional(),
  role: z.enum(["admin", "member", "section_leader"]).default("member"),
  is_admin: z.boolean().default(false),
  status: z.string().default("active"),
  dues_paid: z.boolean().default(false),
  join_date: z.string().optional(),
  notes: z.string().optional(),
  avatar_url: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
