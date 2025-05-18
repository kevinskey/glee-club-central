
// Common types used across supabase query modules

export interface AttendanceRecord {
  id: string;
  member_id: string;
  calendar_event_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string | null;
  created_at: string;
  calendar_events?: {
    id: string;
    title: string;
    date: string;
    time?: string;
    type?: string;
  } | null;
}

export interface PaymentRecord {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string | null;
}

export interface MemberNote {
  id: string;
  member_id: string;
  created_by: string;
  note: string;
  created_at: string;
}

export interface UserPermissions {
  [permission: string]: boolean;
}

// Add type for DB user to match what get_all_users returns
export interface DBUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string;
  voice_part: string;
  avatar_url: string;
  status: string;
  join_date: string;
  created_at: string;
  last_sign_in_at: string;
  role_display_name: string;
  voice_part_display: string;
}
