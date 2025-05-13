
// Define UserTitle as a string to avoid type issues
export type UserTitle = string;

export type PermissionName = 
  | "manage_users"
  | "view_user_details"
  | "edit_user_details"
  | "delete_user"
  | "manage_sheet_music"
  | "view_sheet_music"
  | "edit_sheet_music"
  | "delete_sheet_music"
  | "manage_events"
  | "view_events"
  | "edit_events"
  | "delete_events"
  | "manage_attendance"
  | "view_attendance"
  | "edit_attendance"
  | "manage_finances"
  | "view_finances"
  | "edit_finances"
  | "manage_media"
  | "view_media"
  | "edit_media"
  | "delete_media"
  | "manage_announcements"
  | "create_announcements"
  | "edit_announcements"
  | "delete_announcements"
  | "manage_wardrobe"
  | "view_wardrobe"
  | "edit_wardrobe"
  // Additional permissions needed by the application
  | "can_manage_users"
  | "can_view_financials"
  | "can_edit_financials"
  | "can_upload_sheet_music"
  | "can_view_sheet_music"
  | "can_edit_attendance"
  | "can_view_attendance"
  | "can_view_wardrobe"
  | "can_edit_wardrobe"
  | "can_upload_media"
  | "can_edit_media"
  | "can_delete_media"
  | "can_manage_tour"
  | "can_manage_stage"
  | "can_view_prayer_box"
  | "can_post_announcements"
  | "can_manage_archives";

export interface Permission {
  id: string;
  name: PermissionName;
  description: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
}
