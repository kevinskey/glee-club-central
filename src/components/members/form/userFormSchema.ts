
import { z } from 'zod';

export const userFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  voice_part: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  join_date: z.string().optional(),
  dues_paid: z.boolean().default(false),
  is_admin: z.boolean().default(false),
  skip_email_confirmation: z.boolean().default(true), // Add this field
});

export type UserFormValues = z.infer<typeof userFormSchema>;
