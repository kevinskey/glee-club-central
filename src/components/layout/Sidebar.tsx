
import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { NavItem } from "@/components/layout/NavItem";
import { 
  Bell,
  Calendar, 
  FileText, 
  Home, 
  Music, 
  Users, 
  Video,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { isOpen, onClose } = useSidebar();
  
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-card border-r border-border transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="font-semibold text-lg">Glee World</span>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-3 space-y-1">
          <NavItem href="/dashboard" icon={Home} exact>
            Dashboard
          </NavItem>
          <NavItem href="/dashboard/members" icon={Users}>
            Members
          </NavItem>
          <NavItem href="/dashboard/sheet-music" icon={FileText}>
            Sheet Music
          </NavItem>
          <NavItem href="/dashboard/recordings" icon={Music}>
            Recordings
          </NavItem>
          <NavItem href="/dashboard/videos" icon={Video}>
            Videos
          </NavItem>
          <NavItem href="/dashboard/calendar" icon={Calendar}>
            Calendar
          </NavItem>
          <NavItem href="/dashboard/announcements" icon={Bell}>
            Announcements
          </NavItem>
        </div>
      </div>
    </aside>
  );
}
