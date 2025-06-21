import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Upload, FileSpreadsheet } from "lucide-react";
import { CreateUserModal } from "@/components/members/CreateUserModal";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateUser: () => void;
  onImportUsers: () => void;
}

export function AddUserDialog({
  isOpen,
  onClose,
  onCreateUser,
  onImportUsers,
}: AddUserDialogProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateUser = () => {
    onClose();
    setShowCreateModal(true);
  };

  const handleImportUsers = () => {
    onClose();
    onImportUsers();
  };

  const handleUserCreated = () => {
    setShowCreateModal(false);
    onCreateUser(); // This will refresh the user list
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Add Users
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleCreateUser}
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg w-fit">
                  <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Create Single User</CardTitle>
                <CardDescription>
                  Add one user manually with a form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={handleCreateUser}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User
                </Button>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={handleImportUsers}
            >
              <CardHeader className="text-center">
                <div className="mx-auto p-3 bg-green-100 dark:bg-green-900/20 rounded-lg w-fit">
                  <FileSpreadsheet className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Import from File</CardTitle>
                <CardDescription>
                  Upload a CSV file to add multiple users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleImportUsers}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />
    </>
  );
}
