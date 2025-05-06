import React from "react";
import {
  Calendar,
  Dashboard,
  FileText,
  LayoutDashboard,
  ListChecks,
  LucideIcon,
  Music,
  Settings,
  User,
  Mic,
  Video,
  Mail,
  FileIcon
} from "lucide-react";
import { Icons } from "@/components/Icons";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { NavLink } from "./NavLink";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

interface SidebarNavGroup {
  title: string;
  icon: LucideIcon;
  items: SidebarNavItem[];
}

type SidebarNavProps = {
  items: (SidebarNavItem | SidebarNavGroup)[];
};

export const SidebarNav = ({ items }: SidebarNavProps) => {
  return (
    <div className="flex flex-col space-y-2">
      {items.map((item, index) => {
        if ("items" in item) {
          return (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value={item.title}>
                <AccordionTrigger className="flex items-center space-x-2 py-2 font-medium">
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  <div className="flex flex-col space-y-1">
                    {item.items.map((subItem) => (
                      <NavLink
                        key={subItem.href}
                        href={subItem.href}
                        icon={subItem.icon}
                        disabled={subItem.disabled}
                      >
                        {subItem.title}
                      </NavLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        } else {
          return (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              disabled={item.disabled}
            >
              {item.title}
            </NavLink>
          );
        }
      })}
    </div>
  );
};

const navigationItems: (SidebarNavItem | SidebarNavGroup)[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Dashboard,
  },
  {
    title: "Sheet Music",
    href: "/sheet-music",
    icon: FileText,
  },
  {
    title: "Recordings",
    href: "/recordings",
    icon: Mic,
  },
  {
    title: "Media Library",
    href: "/media-library",
    icon: Video,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: ListChecks,
    disabled: true,
  },
  {
    title: "Messaging",
    href: "/messaging",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Admin",
    icon: Settings,
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: User,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default navigationItems;
