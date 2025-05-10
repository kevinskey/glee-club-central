
import React from "react";
import { Bell, Home, Menu, User, Users, Settings, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNavItem } from "@/components/layout/MobileNavItem";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function MobileNav() {
  const { signOut, profile } = useAuth();
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
        
        {/* Add user dropdown for mobile */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuLabel>
                {profile?.first_name} {profile?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => navigate("/dashboard/profile")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => navigate("/update-password")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Settings className="h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Home className="h-4 w-4" />
                <span>Home Page</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => signOut()}
                className="flex items-center gap-2 cursor-pointer text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
