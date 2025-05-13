
import { EventType } from "@/types/calendar";

// Define form schema values for event creation and editing
export interface EventFormValues {
  title?: string;
  date?: Date;
  time?: string;
  location?: string;
  description?: string;
  type?: EventType | "rehearsal" | "concert" | "sectional" | "special" | "tour";
  image_url?: string | null;
  archivalNotes?: string;
  callTime?: string;
  wakeUpTime?: string;
  departureTime?: string;
  performanceTime?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  transportationCompany?: string;
  transportationDetails?: string;
  contractStatus?: "draft" | "sent" | "signed" | "completed" | "none";
  contractNotes?: string;
}
