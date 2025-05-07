
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { UserFilters } from "@/components/members/UserFilters";

interface UserManagementToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onCreateUserClick: () => void;
  onRefreshClick: () => void;
  isLoading: boolean;
}

export const UserManagementToolbar: React.FC<UserManagementToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onCreateUserClick,
  onRefreshClick,
  isLoading,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
      <UserFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={onCreateUserClick}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
        <Button
          variant="outline"
          onClick={onRefreshClick}
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
    </div>
  );
};
