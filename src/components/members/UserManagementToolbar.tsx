
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserManagementToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onCreateUserClick: () => void;
  onRefreshClick: () => void;
  isLoading?: boolean;
  isMobile?: boolean;
  canCreate?: boolean;
}

export function UserManagementToolbar({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onCreateUserClick,
  onRefreshClick,
  isLoading = false,
  isMobile = false,
  canCreate = true
}: UserManagementToolbarProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          {canCreate && (
            <Button 
              onClick={onCreateUserClick}
              className="bg-brand hover:bg-brand/90"
              size={isMobile ? "sm" : "default"}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {isMobile ? 'Add' : 'Add Member'}
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={onRefreshClick}
            disabled={isLoading}
            size={isMobile ? "icon" : "default"}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""} ${!isMobile && "mr-1"}`} />
            {!isMobile && "Refresh"}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Administrators</SelectItem>
            <SelectItem value="member">Regular Members</SelectItem>
            <SelectItem value="section_leader">Section Leaders</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
