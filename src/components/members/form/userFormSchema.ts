
import * as z from "zod";
import { formatPhoneNumber } from "@/utils/formatters";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const userFormSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").regex(emailRegex, "Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().optional(),
  voice_part: z.enum(["soprano_1", "soprano_2", "alto_1", "alto_2", "tenor", "bass", "director"]).nullable(),
  status: z.enum(["active", "pending", "inactive", "alumni"]).default("active"),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  dues_paid: z.boolean().default(false),
  is_admin: z.boolean().default(false),
  join_date: z.string().optional(),
  role: z.string().optional(),
  avatar_url: z.string().optional()
}).refine((data) => {
  // Require password for new users (when no role is set yet)
  if (!data.role && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Password is required for new users",
  path: ["password"]
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type VoicePart = "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass" | "director" | null;

export const formatUserData = (formData: UserFormValues) => {
  // Format phone number if present
  if (formData.phone) {
    formData.phone = formatPhoneNumber(formData.phone);
  }

  // Ensure password is set for new users
  if (!formData.password) {
    formData.password = Math.random().toString(36).substring(2, 10) + '!';
  }

  return formData;
};
