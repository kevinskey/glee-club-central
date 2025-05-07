
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/hooks/useUserManagement";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { EditUserForm } from "./EditUserForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "./ProfileTabContent";
import { Trash2 } from "lucide-react";

interface UserDetailsSheetProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRoleChange: (userId: string, role: string) => Promise<void>;
  onStatusChange: (userId: string, status: string) => Promise<void>;
  onDeleteClick?: (user: User) => void;
  isUpdating: boolean;
  formatDate: (date?: string | null) => string;
}

export const UserDetailsSheet: React.FC<UserDetailsSheetProps> = ({
  user,
  isOpen,
  onOpenChange,
  onRoleChange,
  onStatusChange,
  onDeleteClick,
  isUpdating,
  formatDate,
}) => {
  if (!user) return null;
  
  const formatVoicePart = (voicePart?: string | null) => {
    // Use voice_part_display if available
    return user.voice_part_display || (voicePart || "Not set");
  };
  
  const getRoleBadge = (role: string) => {
    // Use role_display_name if available
    const displayRole = user.role_display_name || role;
    
    switch (role) {
      case "administrator":
      case "admin":
        return <Badge className="bg-red-500">Admin</Badge>;
      case "section_leader":
        return <Badge className="bg-amber-500">Section Leader</Badge>;
      case "singer":
      case "member":
        return <Badge className="bg-green-500">Member</Badge>;
      default:
        return <Badge className="bg-slate-500">{displayRole}</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-emerald-500">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "alumni":
        return <Badge className="bg-blue-500">Alumni</Badge>;
      default:
        return <Badge className="bg-slate-500">{status}</Badge>;
    }
  };
  
  // Handle role change with debug logging
  const handleRoleChange = async (role: string) => {
    if (!user) return;
    console.log(`UserDetailsSheet: Requesting role change for ${user.id} to ${role}`);
    await onRoleChange(user.id, role);
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              {user.avatar_url ? (
                <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              ) : (
                <AvatarFallback>
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <SheetTitle>{user.first_name} {user.last_name}</SheetTitle>
          </div>
          <SheetDescription className="flex flex-wrap gap-2 items-center">
            {getRoleBadge(user.role)}
            {getStatusBadge(user.status)}
            <span className="text-xs">Voice: {formatVoicePart(user.voice_part)}</span>
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <ProfileTabContent user={user} formatDate={formatDate} />
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4 py-4">
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
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <SheetFooter className="flex-col sm:flex-row gap-2">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
            <Link to={`/dashboard/members/${user.id}`}>
              <Button variant="default">View Full Profile</Button>
            </Link>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
