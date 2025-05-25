
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
  Calendar, 
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
    { icon: Calendar, label: "Calendar", path: "/dashboard/calendar" },
    { icon: Music, label: "Sheet Music", path: "/dashboard/sheet-music" },
    { icon: Mic, label: "Recordings", path: "/dashboard/recordings" },
    { icon: Mic, label: "Recording Studio", path: "/dashboard/recording-studio" },
    { icon: Bell, label: "Announcements", path: "/dashboard/announcements" },
    { icon: Archive, label: "Archives", path: "/dashboard/archives" },
    { icon: ClipboardList, label: "Attendance", path: "/dashboard/attendance" },
    { icon: User, label: "Profile", path: "/dashboard/profile" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {menuItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <DropdownMenuItem 
              onClick={() => navigate(item.path)}
              className="flex items-center cursor-pointer"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
            {index === 3 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
