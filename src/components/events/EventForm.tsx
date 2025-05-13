I don't have the full content of `src/components/events/EventForm.tsx` in the provided code snippets, so I can't provide the complete file with all the existing code. However, based on the error message and the AI's suggested fix, the issue is related to type compatibility between the form's return type and the `EventFormValues` type.

Here's a template for how the file should be structured with the fix applied:

```typescript
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormValues } from "@/components/calendar/EventFormFields";

// Define a schema that matches EventFormValues exactly
const eventFormSchema = z.object({
  title: z.string().optional(),
  date: z.date().optional(),
  time: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["rehearsal", "concert", "sectional", "special", "tour"]).optional(),
  image_url: z.string().nullable().optional(),
  archivalNotes: z.string().optional(),
  callTime: z.string().optional(),
  wakeUpTime: z.string().optional(),
  departureTime: z.string().optional(),
  performanceTime: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  transportationCompany: z.string().optional(),
  transportationDetails: z.string().optional(),
  contractStatus: z.enum(["draft", "sent", "signed", "completed", "none"]).optional(),
  contractNotes: z.string().optional(),
});

// Your component definition
export function EventForm() {
  // Use the schema with useForm to ensure type compatibility
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      time: "",
      location: "",
      description: "",
      type: "concert",
      image_url: null,
    },
  });

  // Rest of your component code...
}
```

Without seeing the full file, I can't provide the complete implementation. If you need the entire file updated, please provide the current content of `src/components/events/EventForm.tsx`.
