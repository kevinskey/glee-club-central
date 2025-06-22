
export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  call_time?: string; // Time when members should arrive
  location_name?: string;
  location_map_url?: string;
  feature_image_url?: string;
  short_description?: string;
  full_description?: string;
  event_host_name?: string;
  event_host_contact?: string;
  event_types?: string[]; // Changed to array for multi-select
  event_type?: string; // Keep for backward compatibility
  is_private: boolean;
  is_public: boolean; // Add the missing is_public property
  allow_rsvp: boolean;
  allow_reminders: boolean;
  allow_ics_download: boolean;
  allow_google_map_link: boolean;
  created_by?: string;
  created_at: string;
  // Recurrence fields
  is_recurring?: boolean;
  recurrence_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
  recurrence_interval?: number;
  recurrence_end_date?: string | null;
  recurrence_count?: number | null;
  parent_event_id?: string | null;
}

export interface Holiday {
  id: string;
  title: string;
  date: Date;
  description: string;
  imageUrl?: string;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'maybe' | 'not_going';
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  user_id: string;
  role: 'public' | 'member' | 'admin';
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  value: any;
  updated_by?: string;
  updated_at: string;
}
