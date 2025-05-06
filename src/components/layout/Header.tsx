
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut, Music, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuProvider,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SidebarNav } from "./SidebarNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewsFeed } from "@/components/news/NewsFeed";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export const Header = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Get role description
  const getRoleDescription = () => {
    if (profile?.role === "admin") {
      return "Admin";
    } else if (profile?.role === "member") {
      return `Member (${profile.voice_part || ''})`;
    }
    return "Member";
  };

  // Navigation sections for mobile menu
  const navigationSections = [
    {
      title: "Main Navigation",
      items: [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Sheet Music", path: "/dashboard/sheet-music" },
        { label: "Practice & Sight Reading", path: "/dashboard/practice" },
        { label: "Recordings", path: "/dashboard/recordings" },
        { label: "Videos", path: "/dashboard/videos" }
      ]
    },
    {
      title: "Additional Resources",
      items: [
        { label: "Schedule", path: "/dashboard/schedule" },
        { label: "Glee Club Handbook", path: "/dashboard/handbook" },
        { label: "Merch", path: "/dashboard/merch" },
        { label: "Attendance", path: "/dashboard/attendance" },
        { label: "Media Library", path: "/dashboard/media-library" }
      ]
    }
  ];

  // Handle navigation with auto-close for mobile menu
  const handleNavigation = (path: string, closeMenu?: () => void) => {
    navigate(path);
    if (closeMenu) closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <NewsFeed />
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-glee-purple">
                  <Music className="h-5 w-5" />
                  Glee World
                </SheetTitle>
                <SheetDescription>
                  Spelman College Choir Digital Hub
                </SheetDescription>
              </SheetHeader>
              
              {/* Mobile accordion-style navigation */}
              <div className="mt-6 flex flex-col space-y-2">
                {navigationSections.map((section, index) => (
                  <Accordion 
                    key={index} 
                    type="single" 
                    collapsible 
                    className="w-full"
                  >
                    <AccordionItem value={`section-${index}`} className="border-b-0">
                      <AccordionTrigger className="py-3 font-medium text-left">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 pl-1">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <SheetClose asChild>
                                <Button
                                  variant="ghost" 
                                  className="w-full justify-start text-sm"
                                  onClick={() => navigate(item.path)}
                                >
                                  <ChevronRight className="mr-2 h-4 w-4" />
                                  {item.label}
                                </Button>
                              </SheetClose>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
                
                {user && (
                  <div className="mt-4 pt-4 border-t">
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => logout()}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <Music className="h-5 w-5 text-glee-purple" />
            <span className="font-playfair text-lg font-semibold text-glee-purple">
              Glee World
            </span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle variant="button" size="sm" />
          
          {user ? (
            <DropdownMenuProvider>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 bg-glee-purple text-white">
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{getDisplayName()}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {getRoleDescription()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    className="flex w-full cursor-pointer items-center"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="flex w-full cursor-pointer items-center"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="flex w-full cursor-pointer items-center text-destructive"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuProvider>
          ) : (
            <Button 
              size="sm" 
              className="bg-glee-purple hover:bg-glee-purple/90"
              onClick={() => navigate("/login")}
            >
              Member Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
