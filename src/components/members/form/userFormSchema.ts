
import { z } from 'zod';

export const userFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().optional(),
  phone: z.string().optional(),
  role: z.string().default("singer"),
  voice_part: z.string().default("soprano_1"),
  status: z.string().default("pending"),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  special_roles: z.string().optional(),
  dues_paid: z.boolean().optional()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
