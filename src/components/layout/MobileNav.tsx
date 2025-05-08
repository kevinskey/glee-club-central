
import React from "react";
import { cn } from "@/lib/utils";
import { MobileNavItem } from "@/components/layout/MobileNavItem";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Home,
  FileMusic,
  ListMusic, 
  Calendar,
  Menu 
} from "lucide-react";

export function MobileNav() {
  const { isOpen, onOpen, onClose } = useSidebar();
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-t bg-background px-4 lg:hidden"
    )}>
      <MobileNavItem
        href="/dashboard"
        title="Home"
        icon={<Home className="h-5 w-5" />}
      />
      <MobileNavItem
        href="/dashboard/sheet-music"
        title="Music"
        icon={<FileMusic className="h-5 w-5" />}
      />
      <MobileNavItem
        href="/dashboard/setlists"
        title="Setlists"
        icon={<ListMusic className="h-5 w-5" />}
      />
      <MobileNavItem
        href="/dashboard/calendar"
        title="Calendar"
        icon={<Calendar className="h-5 w-5" />}
      />
      <MobileNavItem
        href="#sidebar"
        title="Menu"
        icon={<Menu className="h-5 w-5" />}
        onClick={() => isOpen ? onClose() : onOpen()}
      />
    </nav>
  );
}
