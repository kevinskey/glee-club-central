
import React from "react";
import { cn } from "@/lib/utils";
import { MobileNavItem } from "@/components/layout/MobileNavItem";
import { useSidebar } from "@/hooks/use-sidebar";
import { 
  Home,
  FileMusic,
  ListMusic, 
  Calendar,
  Menu,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";

export function MobileNav() {
  const { isOpen, onOpen, onClose } = useSidebar();
  const { isAdmin, profile } = useAuth();
  const { isSuperAdmin } = usePermissions();
  
  // Log user permissions for debugging
  console.log('MobileNav permissions:', { 
    isAdmin: isAdmin(),
    isSuperAdmin, 
    profileSuperAdmin: profile?.is_super_admin
  });
  
  const showAdminLink = isAdmin() || isSuperAdmin || profile?.is_super_admin;
  
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
      {showAdminLink && (
        <MobileNavItem
          href="/dashboard/admin"
          title="Admin"
          icon={<Settings className="h-5 w-5" />}
        />
      )}
      <MobileNavItem
        href="#sidebar"
        title="Menu"
        icon={<Menu className="h-5 w-5" />}
        onClick={() => isOpen ? onClose() : onOpen()}
      />
    </nav>
  );
}
