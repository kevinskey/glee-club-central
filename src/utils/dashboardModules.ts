
import { PermissionName } from '@/types/permissions';

export type ModuleType = {
  id: string;
  title: string;
  description: string;
  icon: string;
  path: string;
  permission: PermissionName;
  color?: string;
  highlight?: boolean;
};

export const dashboardModules: ModuleType[] = [
  {
    id: 'financial-dashboard',
    title: 'Financial Dashboard',
    description: 'View financial reports and budgets',
    icon: 'CreditCard',
    path: '/dashboard/finances',
    permission: 'can_view_financials',
    color: 'bg-emerald-500'
  },
  {
    id: 'dues-manager',
    title: 'Dues Manager',
    description: 'Manage member dues and payments',
    icon: 'DollarSign',
    path: '/dashboard/dues',
    permission: 'can_edit_financials',
    color: 'bg-green-600'
  },
  {
    id: 'sheet-music-library',
    title: 'Sheet Music Library',
    description: 'Browse and manage sheet music',
    icon: 'FileText',
    path: '/dashboard/sheet-music',
    permission: 'can_upload_sheet_music',
    color: 'bg-blue-500'
  },
  {
    id: 'attendance-tracker',
    title: 'Attendance Tracker',
    description: 'View and record member attendance',
    icon: 'CheckSquare',
    path: '/dashboard/attendance',
    permission: 'can_edit_attendance',
    color: 'bg-violet-500'
  },
  {
    id: 'wardrobe-status',
    title: 'Wardrobe Status',
    description: 'Check wardrobe assignments and sizes',
    icon: 'Shirt',
    path: '/dashboard/wardrobe-status',
    permission: 'can_view_wardrobe',
    color: 'bg-rose-500'
  },
  {
    id: 'wardrobe-admin',
    title: 'Wardrobe Admin',
    description: 'Manage wardrobe inventory and assignments',
    icon: 'Scissors',
    path: '/dashboard/wardrobe-admin',
    permission: 'can_edit_wardrobe',
    color: 'bg-pink-600'
  },
  {
    id: 'media-upload',
    title: 'Media Upload',
    description: 'Upload photos, videos, and audio files',
    icon: 'Upload',
    path: '/dashboard/media-library',
    permission: 'can_upload_media',
    color: 'bg-amber-500'
  },
  {
    id: 'tour-management',
    title: 'Tour Management',
    description: 'Plan and organize tour logistics',
    icon: 'Map',
    path: '/dashboard/tour',
    permission: 'can_manage_tour',
    color: 'bg-cyan-600'
  },
  {
    id: 'stage-plot',
    title: 'Stage Plot Manager',
    description: 'Create and manage stage arrangements',
    icon: 'Layout',
    path: '/dashboard/stage-plot',
    permission: 'can_manage_stage',
    color: 'bg-indigo-600'
  },
  {
    id: 'prayer-requests',
    title: 'Prayer Requests',
    description: 'View and submit prayer requests',
    icon: 'Heart',
    path: '/dashboard/prayer',
    permission: 'can_view_prayer_box',
    color: 'bg-red-500'
  },
  {
    id: 'announcements',
    title: 'Announcements',
    description: 'Manage and create announcements',
    icon: 'Bell',
    path: '/dashboard/announcements',
    permission: 'can_post_announcements',
    color: 'bg-yellow-500'
  }
];

export const getPermittedModules = (
  userPermissions: Record<string, boolean> | null,
  isSuperAdmin: boolean = false
): ModuleType[] => {
  if (isSuperAdmin) {
    return dashboardModules;
  }

  if (!userPermissions) {
    return [];
  }

  return dashboardModules.filter(
    (module) => userPermissions[module.permission] === true
  );
};
