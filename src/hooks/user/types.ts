
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
  is_admin?: boolean;
  disabled?: boolean;
  class_year?: string;
  dues_paid?: boolean;
  notes?: string;
  role_tags?: string[];
  personal_title?: string;
  title?: string;
  special_roles?: string[];
  // New e-commerce fields
  ecommerce_enabled?: boolean;
  design_history_ids?: string[];
  current_cart_id?: string;
  default_shipping_address?: string;
  account_balance?: number;
}
