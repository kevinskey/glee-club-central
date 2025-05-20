
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, FileText, FileAudio, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRolePermissions } from '@/contexts/RolePermissionContext';

interface MobileNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

const MobileNavItem = ({ to, icon, label, exact }: MobileNavItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      cn(
        "flex flex-col items-center justify-center text-xs pt-1 pb-0.5 text-muted-foreground",
        isActive && "text-primary"
      )
    }
    end={exact}
  >
    <div className="mb-0.5">{icon}</div>
    <span>{label}</span>
  </NavLink>
);

export function MobileBottomNav() {
  const { userRole } = useRolePermissions();

  // Only show member items for members and admins
  const showMemberItems = userRole === 'member' || userRole === 'admin';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-background border-t py-1 flex items-center justify-around">
      <MobileNavItem 
        to="/dashboard" 
        icon={<Home className="h-5 w-5" />} 
        label="Home" 
        exact={true} 
      />
      
      <MobileNavItem 
        to="/dashboard/calendar" 
        icon={<CalendarDays className="h-5 w-5" />} 
        label="Calendar" 
      />
      
      {showMemberItems && (
        <MobileNavItem 
          to="/dashboard/sheet-music" 
          icon={<FileText className="h-5 w-5" />} 
          label="Music" 
        />
      )}
      
      {showMemberItems && (
        <MobileNavItem 
          to="/dashboard/recordings" 
          icon={<FileAudio className="h-5 w-5" />} 
          label="Recordings" 
        />
      )}
      
      {showMemberItems && (
        <MobileNavItem 
          to="/dashboard/recording-studio" 
          icon={<Mic className="h-5 w-5" />} 
          label="Studio" 
        />
      )}
    </div>
  );
}
