
import React from "react";
import { NavItem } from "@/components/layout/NavItem";
import { 
  Calendar, 
  Music2, 
  Mic2, 
  Video, 
  Book,
  ShoppingBag,
  Users,
  MessageSquare,
  ClipboardCheck,
  LibraryBig,
  ListMusic,
  Megaphone,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: <Music2 className="h-5 w-5" />,
  },
  {
    title: "Setlists",
    href: "/dashboard/setlists",
    icon: <ListMusic className="h-5 w-5" />,
  },
  {
    title: "Recordings",
    href: "/dashboard/recordings",
    icon: <Mic2 className="h-5 w-5" />,
  },
  {
    title: "Videos",
    href: "/dashboard/videos",
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: "Media Library",
    href: "/dashboard/media-library",
    icon: <LibraryBig className="h-5 w-5" />,
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Handbook",
    href: "/dashboard/handbook",
    icon: <Book className="h-5 w-5" />,
  },
  {
    title: "Merchandise",
    href: "/dashboard/merch",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <UserCircle className="h-5 w-5" />,
  },
];

interface SidebarNavItemsProps {
  items: typeof mainNavItems;
}

export function SidebarNavItems({ items }: SidebarNavItemsProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={() => item.icon}
        >
          {item.title}
        </NavItem>
      ))}
    </div>
  );
}
