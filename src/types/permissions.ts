
export type PermissionName = 
  | 'can_view_financials'
  | 'can_edit_financials'
  | 'can_upload_sheet_music'
  | 'can_view_sheet_music'
  | 'can_edit_attendance'
  | 'can_view_attendance'
  | 'can_view_wardrobe'
  | 'can_edit_wardrobe'
  | 'can_upload_media'
  | 'can_manage_tour'
  | 'can_manage_stage'
  | 'can_view_prayer_box'
  | 'can_post_announcements'
  | 'can_manage_users'
  | 'can_manage_archives'
  | 'can_post_social'
  | 'can_view_travel_logistics'
  | 'can_manage_spiritual_events'
  | 'can_grade_submissions'
  | 'can_upload_documents'
  | 'can_view_events'
  | 'can_submit_absence_form';

export type UserTitle =
  | 'Super Admin'
  | 'Treasurer'
  | 'Librarian'
  | 'Wardrobe Mistress'
  | 'Secretary'
  | 'President'
  | 'Historian'
  | 'PR Manager'
  | 'Tour Manager'
  | 'Stage Manager'
  | 'Chaplain'
  | 'Section Leader'
  | 'Student Worker'
  | 'General Member';

export interface UserPermissions {
  [permission: string]: boolean;
}

export interface UserRole {
  title: UserTitle;
  description?: string;
  permissions: UserPermissions;
}
