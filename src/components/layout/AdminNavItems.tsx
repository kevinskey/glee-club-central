
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
  Home,
  Video,
  Settings,
  UserCog,
  DollarSign
} from 'lucide-react';
import { NavItem } from './NavItem';

export function AdminNavItems() {
  return (
    <>
      <NavItem
        href="/admin"
        icon={<Home className="h-5 w-5" />}
        title="Dashboard"
      />
      <NavItem
        href="/admin/members"
        icon={<Users className="h-5 w-5" />}
        title="Members"
      />
      <NavItem
        href="/admin/user-roles"
        icon={<UserCog className="h-5 w-5" />}
        title="User Roles"
      />
      <NavItem
        href="/admin/financial"
        icon={<DollarSign className="h-5 w-5" />}
        title="Financial"
      />
      <NavItem
        href="/admin/calendar"
        icon={<Calendar className="h-5 w-5" />}
        title="Calendar"
      />
      <NavItem
        href="/admin/music"
        icon={<Music className="h-5 w-5" />}
        title="Music Library"
      />
      <NavItem
        href="/admin/videos"
        icon={<Video className="h-5 w-5" />}
        title="Videos"
      />
      <NavItem
        href="/admin/store"
        icon={<ShoppingBag className="h-5 w-5" />}
        title="Store"
      />
      <NavItem
        href="/admin/communications"
        icon={<MessageSquare className="h-5 w-5" />}
        title="Communications"
      />
      <NavItem
        href="/admin/hero-slides"
        icon={<Image className="h-5 w-5" />}
        title="Hero Slides"
      />
      <NavItem
        href="/admin/media"
        icon={<FileImage className="h-5 w-5" />}
        title="Media Library"
      />
      <NavItem
        href="/admin/analytics"
        icon={<BarChart3 className="h-5 w-5" />}
        title="Analytics"
      />
      <NavItem
        href="/admin/settings"
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
      />
    </>
  );
}
