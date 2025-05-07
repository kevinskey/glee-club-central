
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { User } from "@/hooks/useUserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTabContent } from "./ProfileTabContent";
import { UserDetailHeader } from "./detail/UserDetailHeader";
import { ActionsTabContent } from "./detail/ActionsTabContent";
import { UserDetailFooter } from "./detail/UserDetailFooter";

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
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <UserDetailHeader user={user} />
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
            <ActionsTabContent 
              user={user}
              isUpdating={isUpdating}
              onRoleChange={onRoleChange}
              onStatusChange={onStatusChange}
              onDeleteClick={onDeleteClick}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <UserDetailFooter userId={user.id} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
