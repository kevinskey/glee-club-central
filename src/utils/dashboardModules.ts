
import { UserPermission } from "@/types/permissions";

// Define the dashboard module interface
export interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  permissions: string[];
  category: string;
}

// Define all available dashboard modules
export const dashboardModules: DashboardModule[] = [
  {
    id: "sheet_music",
    title: "Sheet Music",
    description: "Access and download sheet music for your voice part",
    icon: "Music",
    color: "bg-purple-500",
    path: "/dashboard/sheet-music",
    permissions: ["can_view_sheet_music"],
    category: "Music"
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "View rehearsals, performances and other events",
    icon: "Calendar",
    color: "bg-green-500",
    path: "/dashboard/calendar",
    permissions: ["can_view_calendar"],
    category: "Events"
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "Track your attendance for rehearsals and events",
    icon: "CheckSquare",
    color: "bg-orange-500",
    path: "/dashboard/attendance",
    permissions: ["can_view_attendance"],
    category: "Performance"
  },
  {
    id: "financial",
    title: "Dues & Payments",
    description: "Manage your dues and view payment history",
    icon: "DollarSign",
    color: "bg-amber-500",
    path: "/dashboard/profile?tab=financial",
    permissions: ["can_view_financial_info"],
    category: "Administration"
  },
  {
    id: "wardrobe",
    title: "Wardrobe",
    description: "View your assigned performance attire",
    icon: "Shirt",
    color: "bg-pink-500",
    path: "/dashboard/profile?tab=wardrobe",
    permissions: ["can_view_wardrobe"],
    category: "Performance"
  },
  {
    id: "announcements",
    title: "Announcements",
    description: "View important club announcements",
    icon: "Bell",
    color: "bg-red-500",
    path: "/dashboard/announcements",
    permissions: ["can_view_announcements"],
    category: "Communication"
  },
  {
    id: "members",
    title: "Members",
    description: "View and manage member directory",
    icon: "Users",
    color: "bg-blue-500",
    path: "/dashboard/members",
    permissions: ["can_view_members"],
    category: "Community"
  },
  {
    id: "practice",
    title: "Practice Resources",
    description: "Access practice tracks and resources",
    icon: "FileText",
    color: "bg-cyan-500",
    path: "/dashboard/practice",
    permissions: ["can_view_practice_resources"],
    category: "Music"
  },
  {
    id: "recordings",
    title: "Recordings",
    description: "Submit and view recordings",
    icon: "Upload",
    color: "bg-indigo-500",
    path: "/dashboard/recordings",
    permissions: ["can_view_recordings"],
    category: "Music"
  },
  {
    id: "handbook",
    title: "Handbook",
    description: "Access the Glee Club handbook",
    icon: "FileText",
    color: "bg-emerald-500",
    path: "/dashboard/handbook",
    permissions: ["can_view_handbook"],
    category: "Administration"
  },
  {
    id: "admin_dashboard",
    title: "Admin Dashboard",
    description: "Access administrative controls",
    icon: "Settings",
    color: "bg-slate-500",
    path: "/dashboard/admin",
    permissions: ["is_admin"],
    category: "Administration"
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View attendance and performance analytics",
    icon: "BarChart",
    color: "bg-violet-500",
    path: "/dashboard/admin/analytics",
    permissions: ["can_view_analytics"],
    category: "Administration"
  },
  {
    id: "messaging",
    title: "Messaging",
    description: "Send and receive messages",
    icon: "Bell",
    color: "bg-rose-500",
    path: "/dashboard/messaging",
    permissions: ["can_use_messaging"],
    category: "Communication"
  }
];

// Function to get modules based on user permissions
export function getPermittedModules(
  permissions: string[] | undefined,
  isSuperAdmin: boolean
): DashboardModule[] {
  if (isSuperAdmin) {
    return dashboardModules;
  }

  if (!permissions || permissions.length === 0) {
    // Return default modules that don't require special permissions
    return dashboardModules.filter(module => 
      module.permissions.includes("can_view_sheet_music") || 
      module.permissions.includes("can_view_calendar")
    );
  }

  return dashboardModules.filter(module => 
    module.permissions.some(permission => permissions.includes(permission))
  );
}

// Function to get a module by ID
export function getModuleById(id: string): DashboardModule | undefined {
  return dashboardModules.find(module => module.id === id);
}
