
import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Users, CalendarDays, FileText, Settings, Image, Layers, Home } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

export function AdminNavItems() {
  const { hasPermission } = usePermissions();
  
  return (
    <div className="flex flex-col gap-1">
      <NavLink to="/admin" className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
      } end>
        <BarChart3 className="h-4 w-4 mr-2" />
        Dashboard
      </NavLink>
      
      {hasPermission('can_manage_users') && (
        <NavLink to="/admin/members" className={({ isActive }) => 
          `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
        }>
          <Users className="h-4 w-4 mr-2" />
          Members
        </NavLink>
      )}
      
      <NavLink to="/admin/events" className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
      }>
        <CalendarDays className="h-4 w-4 mr-2" />
        Events
      </NavLink>
      
      <NavLink to="/admin/media-library" className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
      }>
        <FileText className="h-4 w-4 mr-2" />
        Media Library
      </NavLink>
      
      <NavLink to="/admin/sections" className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
      }>
        <Layers className="h-4 w-4 mr-2" />
        Sections
      </NavLink>
      
      <NavLink to="/admin/landing-page" className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
      }>
        <Home className="h-4 w-4 mr-2" />
        Landing Page
      </NavLink>
      
      <NavLink to="/admin/settings" className={({ isActive }) => 
        `flex items-center px-3 py-2 text-sm rounded-md ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}`
      }>
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </NavLink>
    </div>
  );
}

// Export with a different name as needed by other components
export { AdminNavItems as AdminNavigation };
