
// Define UserTitle as a union type of specific strings
export type UserTitle = 
  | "Super Admin" 
  | "Treasurer" 
  | "Librarian" 
  | "Wardrobe Mistress" 
  | "Secretary" 
  | "President" 
  | "Historian" 
  | "PR Manager" 
  | "Tour Manager" 
  | "Stage Manager" 
  | "Chaplain" 
  | "Section Leader" 
  | "Student Worker" 
  | "General Member";

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
  | "edit_wardrobe";

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
