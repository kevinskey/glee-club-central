
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MemberFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export function MemberFilterBar({ 
  searchTerm, 
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter
}: MemberFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-end">
      <div className="flex-1 relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      
      <div className="w-full md:w-[180px]">
        <Select
          value={roleFilter}
          onValueChange={setRoleFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="administrator">Administrator</SelectItem>
            <SelectItem value="section_leader">Section Leader</SelectItem>
            <SelectItem value="singer">Singer</SelectItem>
            <SelectItem value="student_conductor">Student Conductor</SelectItem>
            <SelectItem value="accompanist">Accompanist</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full md:w-[180px]">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
