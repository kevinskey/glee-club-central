
import * as z from "zod";

export const userFormSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  role: z.string().default("singer"),
  voice_part: z.string().default("soprano_1"),
  status: z.string().default("pending"),
  password: z.string().optional()
});

export type UserFormValues = z.infer<typeof userFormSchema>;
