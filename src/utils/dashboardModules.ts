
// Define the dashboard module interface
export interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
  adminOnly: boolean;
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
    adminOnly: false,
    category: "Music"
  },
  {
    id: "calendar",
    title: "Calendar",
    description: "View rehearsals, performances and other events",
    icon: "Calendar",
    color: "bg-green-500",
    path: "/dashboard/calendar",
    adminOnly: false,
    category: "Events"
  },
  {
    id: "attendance",
    title: "Attendance",
    description: "Track your attendance for rehearsals and events",
    icon: "CheckSquare",
    color: "bg-orange-500",
    path: "/dashboard/attendance",
    adminOnly: false,
    category: "Performance"
  },
  {
    id: "profile",
    title: "My Profile",
    description: "Update your profile and contact information",
    icon: "User",
    color: "bg-blue-500",
    path: "/dashboard/profile",
    adminOnly: false,
    category: "Account"
  },
  {
    id: "practice",
    title: "Practice Resources",
    description: "Access practice tracks and resources",
    icon: "FileText",
    color: "bg-cyan-500",
    path: "/dashboard/practice",
    adminOnly: false,
    category: "Music"
  },
  {
    id: "announcements",
    title: "Announcements",
    description: "View important club announcements",
    icon: "Bell",
    color: "bg-red-500",
    path: "/dashboard/announcements",
    adminOnly: false,
    category: "Communication"
  },
  {
    id: "contact_admin",
    title: "Contact Admin",
    description: "Send a message to administrators",
    icon: "MessageSquare",
    color: "bg-indigo-500",
    path: "/dashboard/contact",
    adminOnly: false,
    category: "Support"
  },
  // Admin-only modules
  {
    id: "user_management",
    title: "User Management",
    description: "Manage all users in the system",
    icon: "Users",
    color: "bg-slate-500",
    path: "/dashboard/admin/users",
    adminOnly: true,
    category: "Administration"
  },
  {
    id: "media_manager",
    title: "Media Manager",
    description: "Upload and organize PDFs and media files",
    icon: "Upload",
    color: "bg-emerald-500",
    path: "/dashboard/admin/media",
    adminOnly: true,
    category: "Administration"
  },
  {
    id: "event_manager",
    title: "Event Manager",
    description: "Create and manage calendar events",
    icon: "CalendarPlus",
    color: "bg-yellow-500",
    path: "/dashboard/admin/events",
    adminOnly: true,
    category: "Administration"
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "View site usage and login activity",
    icon: "BarChart",
    color: "bg-violet-500",
    path: "/dashboard/admin/analytics",
    adminOnly: true,
    category: "Administration"
  },
  {
    id: "settings",
    title: "Site Settings",
    description: "Configure system notifications and permissions",
    icon: "Settings",
    color: "bg-rose-500",
    path: "/dashboard/admin/settings",
    adminOnly: true,
    category: "Administration"
  }
];

// Function to get modules based on user role
export function getModulesByRole(isAdmin: boolean): DashboardModule[] {
  if (isAdmin) {
    return dashboardModules; // Admins can see all modules
  }
  
  // Filter out admin-only modules for general users
  return dashboardModules.filter(module => !module.adminOnly);
}

// Function to get a module by ID
export function getModuleById(id: string): DashboardModule | undefined {
  return dashboardModules.find(module => module.id === id);
}
