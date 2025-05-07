
import { z } from "zod";

export const userFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.string().refine(value => 
    ["singer", "section_leader", "student_conductor", "accompanist", "non_singer", "administrator"].includes(value), 
    "Invalid role"
  ),
  status: z.string().refine(value => 
    ["active", "inactive", "pending", "alumni"].includes(value), 
    "Invalid status"
  ),
  voice_part: z.string().nullable().optional().refine(
    value => value === null || value === undefined || ["soprano_1", "soprano_2", "alto_1", "alto_2", "tenor", "bass"].includes(value),
    "Invalid voice part"
  ),
  phone: z.string().optional().nullable(),
  password: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
