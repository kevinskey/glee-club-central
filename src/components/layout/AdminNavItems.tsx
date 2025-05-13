
import React from 'react';
import { NavLink } from '@/components/layout/NavLink';
import { BarChart3, Users, CalendarDays, FileText, Settings, Image, Layers, Home } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

export function AdminNavItems() {
  const { hasPermission } = usePermissions();
  
  return (
    <div className="flex flex-col gap-1">
      <NavLink to="/admin" exact>
        <BarChart3 className="h-4 w-4 mr-2" />
        Dashboard
      </NavLink>
      
      {hasPermission('can_manage_users') && (
        <NavLink to="/admin/members">
          <Users className="h-4 w-4 mr-2" />
          Members
        </NavLink>
      )}
      
      <NavLink to="/admin/events">
        <CalendarDays className="h-4 w-4 mr-2" />
        Events
      </NavLink>
      
      <NavLink to="/admin/media-library">
        <FileText className="h-4 w-4 mr-2" />
        Media Library
      </NavLink>
      
      <NavLink to="/admin/sections">
        <Layers className="h-4 w-4 mr-2" />
        Sections
      </NavLink>
      
      <NavLink to="/admin/landing-page">
        <Home className="h-4 w-4 mr-2" />
        Landing Page
      </NavLink>
      
      <NavLink to="/admin/settings">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </NavLink>
    </div>
  );
}
