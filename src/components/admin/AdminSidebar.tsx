
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  BarChart3,
  ShoppingCart,
  Megaphone,
  Image,
  Home,
  Palette,
  Music
} from 'lucide-react';
import { ViewSwitcher } from './ViewSwitcher';

const navItems = [
  { to: '/', icon: Home, label: 'Back to Site' },
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/media', icon: Image, label: 'Media Library' },
  { to: '/admin/music', icon: Music, label: 'Music Player' },
  { to: '/admin/store', icon: ShoppingCart, label: 'Store Admin' },
  { to: '/admin/design-studio', icon: Palette, label: 'Design Studio' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 z-30 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Admin Panel
        </h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-glee-spelman text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      <ViewSwitcher />
    </aside>
  );
};
