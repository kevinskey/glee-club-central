
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
  Headphones,
  CreditCard,
  BookOpen,
  ShoppingBag,
  FileImage,
  X,
  Shirt,
  Settings,
  LayoutDashboard,
  BarChart3,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function Sidebar() {
  const { isOpen, onClose } = useSidebar();
  const { profile } = useAuth();
  const [isAdminOpen, setIsAdminOpen] = useState(true);
  
  const isAdmin = profile?.role === "administrator";
  
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 w-64 bg-card border-r border-border transition-transform duration-300 transform ${
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
          <NavItem href="/dashboard/sheet-music" icon={FileText}>
            Sheet Music
          </NavItem>
          <NavItem href="/dashboard/practice" icon={Headphones}>
            Practice
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
          <NavItem href="/dashboard/dues" icon={CreditCard}>
            Pay Dues
          </NavItem>
          <NavItem href="/dashboard/handbook" icon={BookOpen}>
            Handbook
          </NavItem>
          <NavItem href="/dashboard/merch" icon={ShoppingBag}>
            Merch
          </NavItem>
          <NavItem href="/dashboard/media-library" icon={FileImage}>
            Media Library
          </NavItem>
          <NavItem href="/dashboard/messages" icon={MessageSquare}>
            Messages
          </NavItem>
          
          {isAdmin && (
            <>
              <div className="mt-6 mb-2">
                <Collapsible
                  open={isAdminOpen}
                  onOpenChange={setIsAdminOpen}
                  className="w-full"
                >
                  <div className="flex items-center px-3 py-2">
                    <span className="text-xs font-semibold text-muted-foreground flex-1">
                      ADMINISTRATOR
                    </span>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
                        <ChevronDown className="h-4 w-4" style={{ transform: isAdminOpen ? 'rotate(180deg)' : '' }} />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="space-y-1">
                    <NavItem href="/dashboard/admin" icon={LayoutDashboard}>
                      Admin Dashboard
                    </NavItem>
                    <NavItem href="/dashboard/admin/members" icon={Users}>
                      Member Management
                    </NavItem>
                    <NavItem href="/dashboard/announcements" icon={Bell}>
                      Announcements
                    </NavItem>
                    <NavItem href="/dashboard/admin/finances" icon={CreditCard}>
                      Financial Management
                    </NavItem>
                    <NavItem href="/dashboard/admin/wardrobe" icon={Shirt}>
                      Wardrobe Management
                    </NavItem>
                    <NavItem href="/dashboard/admin/analytics" icon={BarChart3}>
                      Analytics
                    </NavItem>
                    <NavItem href="/dashboard/admin/settings" icon={Settings}>
                      Site Settings
                    </NavItem>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
