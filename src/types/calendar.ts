
export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_name?: string;
  location_map_url?: string;
  feature_image_url?: string;
  short_description?: string;
  full_description?: string;
  event_host_name?: string;
  event_host_contact?: string;
  event_type?: string;
  is_private: boolean;
  allow_rsvp: boolean;
  allow_reminders: boolean;
  allow_ics_download: boolean;
  allow_google_map_link: boolean;
  created_by?: string;
  created_at: string;
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
