
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { User } from "@/hooks/useUserManagement";

interface ActionsTabContentProps {
  user: User;
  isUpdating: boolean;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  onStatusChange: (userId: string, status: string) => Promise<void>;
  onDeleteClick?: (user: User) => void;
}

export const ActionsTabContent: React.FC<ActionsTabContentProps> = ({
  user,
  isUpdating,
  onRoleChange,
  onStatusChange,
  onDeleteClick
}) => {
  // Handle role change with debug logging
  const handleRoleChange = async (role: string) => {
    if (!user) return;
    console.log(`ActionsTabContent: Requesting role change for ${user.id} to ${role}`);
    await onRoleChange(user.id, role);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Change Role</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.role === "singer" || isUpdating}
            onClick={() => handleRoleChange("singer")}
          >
            Singer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.role === "section_leader" || isUpdating}
            onClick={() => handleRoleChange("section_leader")}
          >
            Section Leader
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.role === "administrator" || isUpdating}
            onClick={() => handleRoleChange("administrator")}
          >
            Administrator
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.role === "student_conductor" || isUpdating}
            onClick={() => handleRoleChange("student_conductor")}
          >
            Student Conductor
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.role === "accompanist" || isUpdating}
            onClick={() => handleRoleChange("accompanist")}
          >
            Accompanist
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.role === "non_singer" || isUpdating}
            onClick={() => handleRoleChange("non_singer")}
          >
            Non-Singer
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Change Status</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.status === "active" || isUpdating}
            onClick={() => onStatusChange(user.id, "active")}
          >
            Active
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.status === "inactive" || isUpdating}
            onClick={() => onStatusChange(user.id, "inactive")}
          >
            Inactive
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.status === "alumni" || isUpdating}
            onClick={() => onStatusChange(user.id, "alumni")}
          >
            Alumni
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={user.status === "pending" || isUpdating}
            onClick={() => onStatusChange(user.id, "pending")}
          >
            Pending
          </Button>
        </div>
      </div>

      {onDeleteClick && (
        <div>
          <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={() => onDeleteClick(user)}
            disabled={isUpdating}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete User
          </Button>
        </div>
      )}
    </div>
  );
};
