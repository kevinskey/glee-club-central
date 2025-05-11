
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
  };
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

export type UserRole = 'administrator' | 'director' | 'section_leader' | 'singer' | 'student_conductor' | 'accompanist' | 'non_singer' | 'admin' | 'general';
