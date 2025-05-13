import React from "react";
import { NavItem } from "@/components/ui/nav-item";
import {
  BarChart,
  Calendar,
  FileMusic,
  ImageIcon,
  LayoutDashboard,
  Settings,
  Users,
  Palette,
} from "lucide-react";

export const AdminNavItems = () => {
  return (
    <>
      <NavItem
        to="/admin"
        icon={<LayoutDashboard size={18} />}
        label="Dashboard"
        exact
      />
      <NavItem 
        to="/admin/users" 
        icon={<Users size={18} />} 
        label="Users" 
      />
      <NavItem 
        to="/admin/analytics" 
        icon={<BarChart size={18} />} 
        label="Analytics" 
      />
      <NavItem 
        to="/admin/calendar" 
        icon={<Calendar size={18} />} 
        label="Calendar" 
      />
      <NavItem 
        to="/admin/media" 
        icon={<FileMusic size={18} />} 
        label="Media Library" 
      />
      <NavItem
        to="/admin/site-images"
        icon={<ImageIcon size={18} />}
        label="Site Images"
      />
      <NavItem 
        to="/admin/settings" 
        icon={<Settings size={18} />} 
        label="Settings" 
      />
      <NavItem 
        to="/admin/landing-page" 
        icon={<Palette size={18} />} 
        label="Landing Page" 
      />
    </>
  );
};
