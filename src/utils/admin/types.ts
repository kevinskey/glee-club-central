
// Types for admin user operations
export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  voice_part?: string | null;
  phone?: string | null;
  section_id?: string | null;
}

export interface UpdateUserData {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  status?: string;
  voice_part?: string | null;
  phone?: string | null;
  section_id?: string | null;
  password?: string;
}
