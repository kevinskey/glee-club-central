
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, UserCog } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

export function MemberManagementLink() {
  const { hasPermission } = usePermissions();
  const canManageUsers = hasPermission('can_manage_users');
  
  return (
    <>
      {/* Regular member directory link for all users */}
      <NavLink 
        to="/dashboard/members" 
        className={({ isActive }) => 
          `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive 
              ? 'bg-accent text-accent-foreground' 
              : 'hover:bg-accent hover:text-accent-foreground'
          }`
        }
      >
        <Users className="h-4 w-4 mr-2" />
        <span>Member Directory</span>
      </NavLink>
      
      {/* Admin member management link for users with permission */}
      {canManageUsers && (
        <NavLink 
          to="/dashboard/admin/members" 
          className={({ isActive }) => 
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent hover:text-accent-foreground'
            }`
          }
        >
          <UserCog className="h-4 w-4 mr-2" />
          <span>Member Management</span>
        </NavLink>
      )}
    </>
  );
}
