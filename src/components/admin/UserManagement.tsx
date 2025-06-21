import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Search,
  Plus,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Phone,
  Music,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useUserManagement, User } from "@/hooks/user/useUserManagement";
import { UserManagementTableMobile } from "./UserManagementTableMobile";
import { AddUserDialog } from "./AddUserDialog";
import { DatabaseConnectionTest } from "./DatabaseConnectionTest";
import { UserManagementMobile } from "./UserManagementMobile";
import { toast } from "sonner";
import { UserManagementData } from "@/services/userManagementService";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const {
    users,
    isLoading,
    error,
    refreshUsers,
    updateUser: handleUpdateUser,
    addUser: handleAddUserAction,
    deleteUser: handleDeleteUser,
  } = useUserManagement();

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  // Transform User[] to UserManagementData[] format
  const transformedUsers: UserManagementData[] = users
    .filter((user) => user.email) // Filter out users without email
    .map((user) => ({
      id: user.id,
      email: user.email!, // Assert non-null since we filtered
      first_name: user.first_name,
      last_name: user.last_name,
      full_name:
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.email ||
        "Unknown User",
      role: user.role || "member", // Ensure role is always present
      status: user.status || "active",
      disabled: user.disabled || false,
      is_super_admin: user.is_super_admin || false,
      created_at: user.created_at || new Date().toISOString(),
      last_sign_in_at: user.last_sign_in_at,
      phone: user.phone,
      voice_part: user.voice_part,
      avatar_url: user.avatar_url,
      join_date: user.join_date,
      class_year: user.class_year,
      dues_paid: user.dues_paid,
      notes: user.notes,
    }));

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const success = await handleUpdateUser(userId, { role: newRole });
    if (success) {
      toast.success("User role updated successfully");
    } else {
      toast.error("Failed to update user role");
    }
  };

  const handleStatusToggle = async (userId: string, isDisabled: boolean) => {
    const success = await handleUpdateUser(userId, { disabled: isDisabled });
    if (success) {
      toast.success(`User ${isDisabled ? "disabled" : "enabled"} successfully`);
    } else {
      toast.error("Failed to update user status");
    }
  };

  const handleAddUser = () => {
    setShowAddDialog(true);
  };

  const handleUserAdded = () => {
    refreshUsers();
    setShowAddDialog(false);
  };

  const handleImportUsers = () => {
    setShowImportDialog(true);
  };

  const handleImportComplete = () => {
    setShowImportDialog(false);
    refreshUsers();
  };

  const filteredUsers = transformedUsers.filter(
    (user) =>
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile View */}
      <div className="block md:hidden">
        {/* Mobile Header with Dropdown */}
        <div className="bg-white dark:bg-gray-800 border-b px-2 py-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-lg font-semibold text-navy-900 dark:text-white">
                User Management
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Manage Glee Club members ({users.length} total)
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2">
                  <Menu className="h-4 w-4 mr-1" />
                  Actions
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleAddUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleImportUsers}>
                  <Users className="mr-2 h-4 w-4" />
                  Import Users
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <DatabaseConnectionTest />

          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm text-navy-900 dark:text-gray-100 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>
        </div>

        {/* User List - No Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Loading...
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-medium text-navy-900 dark:text-white mb-1">
                  No Members Found
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {users.length === 0
                    ? "No members added yet."
                    : "No members match search."}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white dark:bg-gray-800 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {`${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1 mb-1">
                          <h3 className="font-medium text-sm text-navy-900 dark:text-white truncate">
                            {user.first_name} {user.last_name}
                          </h3>
                          {user.is_super_admin && (
                            <Badge
                              variant="destructive"
                              className="text-xs px-1 py-0"
                            >
                              Admin
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <Mail className="mr-1 h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{user.email}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          {user.voice_part && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1 py-0"
                            >
                              <Music className="mr-1 h-2 w-2" />
                              {user.voice_part.replace("_", " ")}
                            </Badge>
                          )}
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                            className="text-xs px-1 py-0"
                          >
                            {user.status}
                          </Badge>
                          {user.dues_paid && (
                            <Badge
                              variant="default"
                              className="bg-green-600 text-xs px-1 py-0"
                            >
                              ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 flex-shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block space-y-3 p-3">
        {/* Desktop Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage Glee Club members ({users.length} total)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        <DatabaseConnectionTest />

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 w-full rounded border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Voice</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dues</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <h3 className="font-semibold mb-1">No Members Found</h3>
                      <p className="text-muted-foreground">
                        {users.length === 0
                          ? "No members added yet."
                          : "No members match search."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell className="py-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {`${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="mr-2 h-4 w-4" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        {user.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="mr-2 h-4 w-4" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        {user.voice_part && (
                          <Badge variant="outline">
                            <Music className="mr-2 h-4 w-4" />
                            {user.voice_part.replace("_", " ")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        {user.class_year && (
                          <Badge variant="outline">{user.class_year}</Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant={
                            user.role === "admin" ? "destructive" : "outline"
                          }
                        >
                          {user.is_super_admin ? "Super" : user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        {user.dues_paid && (
                          <Badge variant="default" className="bg-green-600">
                            ✓
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add User Dialog */}
      <AddUserDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onCreateUser={handleUserAdded}
        onImportUsers={handleImportUsers}
      />

      {/* Import Users Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-navy-900">
                Import Users from CSV
              </h2>
              <Button
                variant="ghost"
                onClick={() => setShowImportDialog(false)}
              >
                ×
              </Button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload CSV to bulk import members.
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.info("CSV import functionality coming soon");
                    handleImportComplete();
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
