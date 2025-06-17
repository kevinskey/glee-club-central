
import { z } from 'zod';

export const userFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  voice_part: z.enum(['soprano_1', 'soprano_2', 'alto_1', 'alto_2', 'tenor', 'bass', 'director']).optional(),
  role: z.enum(['admin', 'member', 'section_leader']).default('member'),
  status: z.enum(['active', 'inactive', 'pending', 'alumni']).default('active'),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  join_date: z.string().optional(),
  dues_paid: z.boolean().default(false),
  is_admin: z.boolean().default(false),
  skip_email_confirmation: z.boolean().default(true),
  title: z.enum(['none', 'President', 'Vice President', 'Secretary', 'Treasurer', 'Chief of Staff', 'Historian', 'Librarian', 'Wardrobe Manager', 'Social Chair', 'Publicity Chair', 'Chaplain', 'Business Manager', 'Assistant Director', 'Director']).default('none').optional(),
  avatar_url: z.string().optional(),
  ecommerce_enabled: z.boolean().default(false).optional(),
  account_balance: z.number().default(0).optional(),
  default_shipping_address: z.string().optional(),
  design_history_ids: z.array(z.string()).default([]).optional(),
  current_cart_id: z.string().optional(),
  role_tags: z.array(z.string()).default([]).optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
