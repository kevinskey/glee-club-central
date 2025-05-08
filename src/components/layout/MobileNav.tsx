
import React from "react";
import { cn } from "@/lib/utils";
import { MobileNavItem } from "@/components/layout/MobileNavItem";
import { useSidebar } from "@/hooks/use-sidebar";

export function MobileNav() {
  const { isOpen, onOpen, onClose } = useSidebar();
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-t bg-background px-4 lg:hidden"
    )}>
      <MobileNavItem
        href="/dashboard"
        title="Home"
      />
      <MobileNavItem
        href="/dashboard/sheet-music"
        title="Music"
      />
      <MobileNavItem
        href="/dashboard/setlists"
        title="Setlists"
      />
      <MobileNavItem
        href="/dashboard/calendar"
        title="Calendar"
      />
      <MobileNavItem
        href="#sidebar"
        title="Menu"
        onClick={() => isOpen ? onClose() : onOpen()}
      />
    </nav>
  );
}
