
export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  voice_part?: string;
  avatar_url?: string;
  status?: string;
  join_date?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  is_super_admin?: boolean;
  disabled?: boolean;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
  role_tags?: string[];
  personal_title?: string;
  title?: string;
  special_roles?: string[];
}
