
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CreateUserForm } from "@/components/members/CreateUserForm";
import { EditUserForm } from "@/components/members/EditUserForm";
import { DeleteUserDialog } from "@/components/members/DeleteUserDialog";
import { User } from "@/hooks/useUserManagement";
import { UserFormValues } from "@/components/members/form/userFormSchema";

interface UserDialogsProps {
  isCreateUserOpen: boolean;
  setIsCreateUserOpen: (open: boolean) => void;
  isEditUserOpen: boolean;
  setIsEditUserOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  selectedUser: User | null;
  userToDelete: User | null;
  isSubmitting: boolean;
  onCreateUser: (data: UserFormValues) => Promise<void>;
  onEditUser: (data: UserFormValues) => Promise<void>;
  onDeleteUser: () => Promise<void>;
}

export const UserDialogs: React.FC<UserDialogsProps> = ({
  isCreateUserOpen,
  setIsCreateUserOpen,
  isEditUserOpen,
  setIsEditUserOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedUser,
  userToDelete,
  isSubmitting,
  onCreateUser,
  onEditUser,
  onDeleteUser,
}) => {
  return (
    <>
      {/* Create User Sheet */}
      <Sheet open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New User</SheetTitle>
            <SheetDescription>
              Create a new user account. All users will receive an email invitation.
            </SheetDescription>
          </SheetHeader>
          
          <CreateUserForm onSubmit={onCreateUser} isSubmitting={isSubmitting} />
        </SheetContent>
      </Sheet>

      {/* Edit User Sheet */}
      <Sheet open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update user information and permissions
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <EditUserForm 
              user={selectedUser}
              onSubmit={onEditUser}
              isSubmitting={isSubmitting}
            />
          )}
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <DeleteUserDialog 
        user={userToDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteConfirm={onDeleteUser}
        isSubmitting={isSubmitting}
      />
    </>
  );
};
