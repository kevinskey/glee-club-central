
export type UserLevel = 'guest' | 'member' | 'admin';

// Add backward compatibility type for PermissionName
export type PermissionName = 
  | 'view_sheet_music'
  | 'view_calendar'
  | 'view_announcements'
  | 'view_financials'
  | 'manage_users'
  | 'upload_media'
  | 'edit_calendar'
  | 'change_roles';

