
import React from "react";
import {
  Calendar,
  LayoutDashboard,
  FileText,
  ListChecks,
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
  icon: React.ReactNode;
  disabled?: boolean;
}

interface SidebarNavGroup {
  title: string;
  icon: React.ReactNode;
  items: SidebarNavItem[];
}

type SidebarNavProps = {
  items?: (SidebarNavItem | SidebarNavGroup)[];
  className?: string;
};

export const SidebarNav: React.FC<SidebarNavProps> = ({ items = navigationItems, className }) => {
  return (
    <div className={`flex flex-col space-y-2 ${className || ''}`}>
      {items.map((item, index) => {
        if ("items" in item) {
          return (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value={item.title}>
                <AccordionTrigger className="flex items-center space-x-2 py-2 font-medium">
                  {item.icon}
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
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Sheet Music",
    href: "/sheet-music",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Recordings",
    href: "/recordings",
    icon: <Mic className="h-5 w-5" />,
  },
  {
    title: "Media Library",
    href: "/media-library",
    icon: <Video className="h-5 w-5" />,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: <ListChecks className="h-5 w-5" />,
    disabled: true,
  },
  {
    title: "Messaging",
    href: "/messaging",
    icon: <Mail className="h-5 w-5" />,
  },
  {
    title: "Admin",
    icon: <Settings className="h-5 w-5" />,
    items: [
      {
        title: "Users",
        href: "/admin/users",
        icon: <User className="h-5 w-5" />,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

export default navigationItems;
