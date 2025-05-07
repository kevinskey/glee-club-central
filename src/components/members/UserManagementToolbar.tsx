
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RefreshCw, PlusCircle, Search } from "lucide-react";

interface UserManagementToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onCreateUserClick: () => void;
  onRefreshClick: () => void;
  isLoading: boolean;
  isMobile?: boolean;
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
  isMobile = false,
}: UserManagementToolbarProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={onCreateUserClick}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {!isMobile ? "Add Member" : "Add"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onRefreshClick} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {!isMobile ? "Refresh" : ""}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="z-[110] bg-background">
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="administrator">Administrator</SelectItem>
            <SelectItem value="section_leader">Section Leader</SelectItem>
            <SelectItem value="student_conductor">Student Conductor</SelectItem>
            <SelectItem value="singer">Singer</SelectItem>
            <SelectItem value="accompanist">Accompanist</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="z-[110] bg-background">
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
