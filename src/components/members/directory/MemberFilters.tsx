
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface MemberFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export function MemberFilters({
  searchTerm,
  setSearchTerm,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  onRefresh,
  isLoading
}: MemberFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Search and filters */}
      <div className="flex-1 min-w-[200px]">
        <Input
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex-1 min-w-[150px]">
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Administrators</SelectItem>
            <SelectItem value="section_leader">Section Leaders</SelectItem>
            <SelectItem value="student_conductor">Student Conductors</SelectItem>
            <SelectItem value="accompanist">Accompanists</SelectItem>
            <SelectItem value="singer">Singers</SelectItem>
            <SelectItem value="member">Regular Members</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[150px]">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="alumni">Alumni</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        onClick={onRefresh}
        className="flex-shrink-0"
        disabled={isLoading}
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        {isLoading ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  );
}
