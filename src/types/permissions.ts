
export type PermissionName = 
  | "can_view_financials"
  | "can_edit_financials"
  | "can_upload_sheet_music"
  | "can_view_sheet_music"
  | "can_edit_attendance"
  | "can_view_attendance"
  | "can_view_wardrobe"
  | "can_edit_wardrobe"
  | "can_upload_media"
  | "can_manage_tour"
  | "can_manage_stage"
  | "can_view_prayer_box"
  | "can_post_announcements"
  | "can_manage_users";

// Changed from a union type to a simple string type
// This allows for dynamic titles from the database
export type UserTitle = string;
