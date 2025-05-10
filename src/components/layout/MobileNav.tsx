
import React from "react";
import { Bell, Home, Menu, User, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavItem } from "@/components/layout/MobileNavItem";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function MobileNav() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <>
      <div className="flex sm:hidden items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-0 pt-12">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      
      <div
        className="fixed bottom-0 left-0 right-0 border-t bg-background sm:hidden flex justify-around py-2 z-50"
      >
        <MobileNavItem href="/" title="Home" icon={<Home />} onClick={() => navigate("/")} />
        <MobileNavItem href="/dashboard/members" title="Members" icon={<Users />} />
        <MobileNavItem href="/dashboard/announcements" title="Updates" icon={<Bell />} />
        <MobileNavItem href="/dashboard/profile" title="Profile" icon={<User />} />
      </div>
    </>
  );
}
