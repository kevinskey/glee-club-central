
import React from "react";
import { User } from "@/hooks/useUserManagement";

interface ProfileTabContentProps {
  user: User;
  formatDate: (date?: string | null) => string;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({ user, formatDate }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
        <p className="font-medium">{user.email || "Not set"}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
        <p className="font-medium">{user.phone || "Not set"}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
          <p className="font-medium">{formatDate(user.created_at)}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Last Login</h3>
          <p className="font-medium">{formatDate(user.last_sign_in_at)}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Section</h3>
        <p className="font-medium">{user.section_name || "Not assigned"}</p>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">Join Date</h3>
        <p className="font-medium">{formatDate(user.join_date)}</p>
      </div>
    </div>
  );
};
