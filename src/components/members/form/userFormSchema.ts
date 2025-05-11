
import * as z from "zod";

export const userFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["admin", "director", "student", "section_leader", "staff", "guest"], {
    required_error: "Please select a role",
  }),
  voice_part: z.enum(["soprano_1", "soprano_2", "alto_1", "alto_2", "tenor", "bass"], {
    required_error: "Please select a voice part",
  }).nullable(),
  status: z.enum(["active", "pending", "inactive", "alumni"], {
    required_error: "Please select a status",
  }),
  join_date: z.string().optional(),
  class_year: z.string().optional(),
  notes: z.string().optional(),
  dues_paid: z.boolean().optional().default(false),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
