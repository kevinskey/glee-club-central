import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavItem } from "./NavItem";
import { Users } from "lucide-react";

export function Header() {
  const { profile, signOut } = useAuth();

  // Fix the UserRole import and ensure the comparison is made correctly
  const renderAdminLinks = () => {
    if (profile?.role === "administrator") {
      return (
        <NavItem href="/dashboard/member-management" icon={<Users size={16} />}>
          Member Management
        </NavItem>
      );
    }
    return null;
  };

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-bold">
          Glee Club
        </Link>
        <Sheet>
          <SheetTrigger>
            <Menu className="h-6 w-6 lg:hidden" />
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Navigate through the application.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <NavItem href="/dashboard" icon={<Users size={16} />}>
                Dashboard
              </NavItem>
              {renderAdminLinks()}
              <NavItem href="/dashboard/profile" icon={<Users size={16} />}>
                Profile
              </NavItem>
              <NavItem href="/dashboard/member-directory" icon={<Users size={16} />}>
                Member Directory
              </NavItem>
              <button
                onClick={signOut}
                className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-secondary"
              >
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
        <nav className="hidden lg:flex gap-6">
          <NavItem href="/dashboard" icon={<Users size={16} />}>
            Dashboard
          </NavItem>
          {renderAdminLinks()}
          <NavItem href="/dashboard/profile" icon={<Users size={16} />}>
            Profile
          </NavItem>
          <NavItem href="/dashboard/member-directory" icon={<Users size={16} />}>
            Member Directory
          </NavItem>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-secondary"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
}
