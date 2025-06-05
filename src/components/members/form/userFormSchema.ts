
import { z } from "zod";

export const userFormSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().optional(),
  voice_part: z.enum(["soprano_1", "soprano_2", "alto_1", "alto_2", "tenor", "bass", "director"]).nullable().optional(),
  role: z.enum(["admin", "member", "section_leader"]).default("member"),
  status: z.enum(["active", "pending", "inactive", "alumni"]).default("active"),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  dues_paid: z.boolean().default(false),
  is_admin: z.boolean().default(false),
  join_date: z.string().optional(),
  avatar_url: z.string().optional(),
  role_tags: z.array(z.string()).optional(),
  // E-commerce fields
  ecommerce_enabled: z.boolean().default(false),
  account_balance: z.number().min(0).default(0),
  default_shipping_address: z.string().optional(),
  design_history_ids: z.array(z.string()).optional(),
  current_cart_id: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
