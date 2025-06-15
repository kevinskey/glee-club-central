
import React from 'react';
import { 
  Users, 
  Calendar, 
  Music, 
  ShoppingBag, 
  MessageSquare, 
  Image, 
  FileImage,
  BarChart3,
  Home
} from 'lucide-react';
import { NavItem } from './NavItem';

export function AdminNavItems() {
  return (
    <>
      <NavItem
        to="/admin"
        icon={<Home className="h-5 w-5" />}
        label="Dashboard"
        end={true}
      />
      <NavItem
        to="/admin/members"
        icon={<Users className="h-5 w-5" />}
        label="Members"
      />
      <NavItem
        to="/admin/calendar"
        icon={<Calendar className="h-5 w-5" />}
        label="Calendar"
      />
      <NavItem
        to="/admin/music"
        icon={<Music className="h-5 w-5" />}
        label="Music Library"
      />
      <NavItem
        to="/admin/store"
        icon={<ShoppingBag className="h-5 w-5" />}
        label="Store"
      />
      <NavItem
        to="/admin/communications"
        icon={<MessageSquare className="h-5 w-5" />}
        label="Communications"
      />
      <NavItem
        to="/admin/hero-slides"
        icon={<Image className="h-5 w-5" />}
        label="Hero Slides"
      />
      <NavItem
        to="/admin/media"
        icon={<FileImage className="h-5 w-5" />}
        label="Media Library"
      />
      <NavItem
        to="/admin/analytics"
        icon={<BarChart3 className="h-5 w-5" />}
        label="Analytics"
      />
    </>
  );
}
