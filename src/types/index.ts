
// Common types used throughout the application
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  role_tags?: string[];
  is_super_admin?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType;
  roles?: string[];
}
