
import React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useSidebar } from "@/hooks/use-sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Home, 
  Settings, 
  Users, 
  LucideIcon, 
  CalendarDays,
  FileText,
  Mic,
  MessageSquare,
  Music
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MenuItemProps {
  title: string;
  icon: LucideIcon;
  href: string;
  requiredRoles?: string[];
  onClick?: () => void;
}

interface MenuSectionProps {
  title: string;
  icon: LucideIcon;
  href: string;
  submenu?: MenuItemProps[];
  requiredRoles?: string[];
}

export function SidebarNav() {
  const { isOpen, onOpen, onClose } = useSidebar()
  const { isAdmin } = useAuth()
  const navigate = useNavigate();

  const renderMenuItem = (item: MenuItemProps) => {
    if (item.requiredRoles && !item.requiredRoles.every(role => isAdmin())) {
      return null;
    }

    return (
      <a
        key={item.title}
        href={item.href}
        className="group flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-muted hover:underline"
        onClick={(e) => {
          e.preventDefault();
          onClose();
          navigate(item.href);
          if (item.onClick) {
            item.onClick();
          }
        }}
      >
        <item.icon className="h-4 w-4" />
        <span>{item.title}</span>
      </a>
    );
  };

  const renderMenuSection = (section: MenuSectionProps) => {
    if (section.requiredRoles && !section.requiredRoles.every(role => isAdmin())) {
      return null;
    }

    if (section.submenu && section.submenu.length > 0) {
      return (
        <AccordionItem value={section.title} key={section.title}>
          <AccordionTrigger className="group flex items-center justify-between rounded-md p-2 text-sm font-medium hover:bg-muted hover:no-underline">
            <div className="flex items-center space-x-2">
              <section.icon className="h-4 w-4" />
              <span>{section.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid pt-2 text-sm">
              {section.submenu.map(item => renderMenuItem(item))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    }

    return renderMenuItem({
      title: section.title,
      icon: section.icon,
      href: section.href,
      requiredRoles: section.requiredRoles,
    });
  };

  // Simplified menu items structure to remove duplicates
  const menuItems: MenuSectionProps[] = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Members",
      icon: Users,
      href: "#",
      submenu: [
        {
          title: "Member Directory",
          icon: Users,
          href: "/dashboard/member-directory",
        },
        {
          title: "Member Management",
          icon: Users,
          href: "/dashboard/members-management",
          requiredRoles: ["administrator"],
        },
      ],
    },
    {
      title: "Events",
      icon: CalendarDays,
      href: "/dashboard/calendar",
    },
    {
      title: "Sheet Music",
      icon: FileText,
      href: "/dashboard/sheet-music",
    },
    {
      title: "Rehearsals",
      icon: Mic,
      href: "/dashboard/rehearsals",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/dashboard/messages",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-full sm:w-64">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate through your dashboard.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-2" />
          <ScrollArea className="my-4">
            <div className="flex flex-col space-y-1">
              <Accordion type="single" collapsible className="w-full">
                {menuItems.map(section => renderMenuSection(section))}
              </Accordion>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <aside className="fixed hidden md:flex flex-col w-64 h-screen border-r bg-card">
        <div className="p-4">
          <h2 className="font-semibold text-lg">Glee World</h2>
          <p className="text-sm text-muted-foreground">Member Dashboard</p>
        </div>
        <Separator />
        <ScrollArea className="flex-1 pt-2">
          <div className="flex flex-col space-y-1 p-2">
            <Accordion type="single" collapsible className="w-full">
              {menuItems.map(section => renderMenuSection(section))}
            </Accordion>
          </div>
        </ScrollArea>
        <Separator />
        <div className="p-4">
          <p className="text-xs text-muted-foreground">Spelman College Glee Club</p>
        </div>
      </aside>
    </>
  );
}
