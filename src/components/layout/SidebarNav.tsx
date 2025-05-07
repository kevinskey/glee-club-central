
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
import { Home, Settings, Users, LucideIcon } from "lucide-react";
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
        className="group flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline"
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
          <AccordionTrigger className="group flex items-center justify-between rounded-md p-2 text-sm font-medium hover:underline">
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

  const menuItems: MenuSectionProps[] = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      title: "Members",
      icon: Users,
      href: "/dashboard/members",
      submenu: [
        {
          title: "Directory",
          icon: Users,
          href: "/dashboard/member-directory",
        },
        {
          title: "Add Member",
          icon: Users,
          href: "/dashboard/members/add",
          requiredRoles: ["administrator"],
        },
        {
          title: "Management",
          icon: Users,
          href: "/dashboard/member-management",
          requiredRoles: ["administrator"],
        },
      ],
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger asChild>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground sm:hidden">
          Open Menu
        </button>
      </SheetTrigger>
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
            <Accordion type="single" collapsible>
              {menuItems.map(section => renderMenuSection(section))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
