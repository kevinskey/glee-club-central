
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { 
  Menu,
  Music, 
  Bell, 
  FileText, 
  User,
  Mic,
  Archive,
  ClipboardList
} from "lucide-react";

export function MobileNavDropdown() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Profile", path: "/dashboard/profile" },
    { icon: Music, label: "Sheet Music", path: "/dashboard/sheet-music" },
    { icon: Mic, label: "Recordings", path: "/dashboard/recordings" },
    { icon: Mic, label: "Recording Studio", path: "/dashboard/recording-studio" },
    { icon: Bell, label: "Announcements", path: "/dashboard/announcements" },
    { icon: Archive, label: "Archives", path: "/dashboard/archives" },
    { icon: ClipboardList, label: "Attendance", path: "/dashboard/attendance" },
  ];

  const handleItemClick = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  const handleOpenChange = (open: boolean) => {
    console.log("Dropdown open state:", open);
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={() => console.log("Menu button clicked")}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-popover border shadow-md z-50"
        sideOffset={5}
      >
        {menuItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <DropdownMenuItem 
              onClick={() => handleItemClick(item.path)}
              className="flex items-center cursor-pointer hover:bg-accent"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
            {index === 0 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
