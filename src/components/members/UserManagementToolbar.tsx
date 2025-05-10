
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, RefreshCw, Filter, UserPlus } from "lucide-react";

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
  isMobile: boolean;
  canCreate: boolean;
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
  isLoading,
  isMobile,
  canCreate
}: UserManagementToolbarProps) {
  return (
    <div className="mb-4 flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        {!isMobile && (
          <>
            <Select
              value={roleFilter}
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
                <SelectItem value="section_leader">Section Leader</SelectItem>
                <SelectItem value="singer">Singer</SelectItem>
                <SelectItem value="student_conductor">Student Conductor</SelectItem>
                <SelectItem value="accompanist">Accompanist</SelectItem>
                <SelectItem value="non_singer">Non-Singer</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
      </div>
      
      <div className="flex space-x-2">
        {isMobile && (
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={onRefreshClick}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
        
        {canCreate && (
          <Button onClick={onCreateUserClick}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        )}
      </div>
    </div>
  );
}
