
import React from "react";
import { NavItem } from "@/components/layout/NavItem";
import { 
  LayoutDashboard, 
  FileMusic, 
  ListMusic,
  Calendar, 
  Headphones, 
  Video,
  DollarSign,
  Book,
  ShoppingBag,
  FolderOpen,
  UserCircle,
  Users,
  Megaphone,
  ClipboardCheck,
  MessageCircle
} from "lucide-react";

export interface NavItemType {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const mainNavItems: NavItemType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Sheet Music",
    href: "/dashboard/sheet-music",
    icon: <FileMusic className="h-5 w-5" />,
  },
  {
    title: "Setlists",
    href: "/dashboard/setlists",
    icon: <ListMusic className="h-5 w-5" />,
  },
  {
    title: "Calendar",
    href: "/dashboard/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Practice",
    href: "/dashboard/practice",
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    title: "Recordings",
    href: "/dashboard/recordings",
    icon: <Headphones className="h-5 w-5" />,
  },
  {
    title: "Videos",
    href: "/dashboard/videos",
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: "Dues Payment",
    href: "/dashboard/dues",
    icon: <DollarSign className="h-5 w-5" />,
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
    title: "Media Library",
    href: "/dashboard/media-library",
    icon: <FolderOpen className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Announcements",
    href: "/dashboard/announcements",
    icon: <Megaphone className="h-5 w-5" />,
  },
  {
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    title: "Messages",
    href: "/dashboard/messages",
    icon: <MessageCircle className="h-5 w-5" />,
  },
];

interface SidebarNavItemsProps {
  items: NavItemType[];
}

export function SidebarNavItems({ items }: SidebarNavItemsProps) {
  return (
    <nav className="grid items-start px-2 gap-1">
      {items.map((item, index) => (
        <NavItem 
          key={index}
          href={item.href}
          icon={() => item.icon}
        >
          {item.title}
        </NavItem>
      ))}
    </nav>
  );
}
