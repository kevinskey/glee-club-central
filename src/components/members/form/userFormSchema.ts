
import * as z from "zod";
import { formatPhoneNumber } from "@/utils/formatters";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const userFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").regex(emailRegex, "Invalid email format"),
  password: z.string().optional(),
  phone: z.string().optional(),
  voice_part: z.enum(["soprano_1", "soprano_2", "alto_1", "alto_2", "tenor", "bass"]).nullable(),
  status: z.enum(["active", "pending", "inactive", "alumni"]).default("active"),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  dues_paid: z.boolean().default(false),
  is_admin: z.boolean().default(false)
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type VoicePart = "soprano_1" | "soprano_2" | "alto_1" | "alto_2" | "tenor" | "bass" | null;

export const formatUserData = (formData: UserFormValues) => {
  // Format phone number if present
  if (formData.phone) {
    formData.phone = formatPhoneNumber(formData.phone);
  }

  return formData;
};
