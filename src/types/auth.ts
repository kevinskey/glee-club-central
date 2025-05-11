export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    name?: string;
    email?: string;
    picture?: string;
  };
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
  role?: string;
  aud?: string;
  created_at?: string;
}
