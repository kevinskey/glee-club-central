
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/hooks/useUserManagement";

interface UserDetailsSheetProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  onStatusChange: (userId: string, status: string) => Promise<void>;
  isUpdating: boolean;
  formatDate: (dateString?: string | null) => string;
}

export const UserDetailsSheet: React.FC<UserDetailsSheetProps> = ({
  user,
  isOpen,
  onOpenChange,
  onRoleChange,
  onStatusChange,
  isUpdating,
  formatDate,
}) => {
  if (!user) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Member Details</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} />
              ) : (
                <AvatarFallback className="text-lg">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div>
              <h3 className="text-xl font-medium">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Role</p>
                <Select
                  value={user.role}
                  onValueChange={(value) => {
                    onRoleChange(user.id, value);
                  }}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="section_leader">Section Leader</SelectItem>
                    <SelectItem value="student_conductor">Student Conductor</SelectItem>
                    <SelectItem value="accompanist">Accompanist</SelectItem>
                    <SelectItem value="singer">Singer</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <p className="text-sm font-medium">Status</p>
                <Select
                  value={user.status}
                  onValueChange={(value) => {
                    onStatusChange(user.id, value);
                  }}
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="alumni">Alumni</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Voice Part</p>
              <p className="text-sm">{user.voice_part_display || "Not set"}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Section</p>
              <p className="text-sm">{user.section_name || "Not assigned"}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm">{user.phone || "Not provided"}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Join Date</p>
                <p className="text-sm">{formatDate(user.join_date)}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Last Login</p>
                <p className="text-sm">{formatDate(user.last_sign_in_at)}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
