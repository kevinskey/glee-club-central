
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, ArrowDown, ArrowUp } from "lucide-react";
import { User } from "@/hooks/useUserManagement";
import { updateUserRole, updateUserStatus } from "@/utils/supabaseQueries";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

// Define a simple table without tanstack/react-table dependency
interface UsersTableProps {
  data: User[];
  fetchUsers: () => Promise<void>;
}

export function UsersTable({ data, fetchUsers }: UsersTableProps) {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState("");

  // Filter the data based on the filter value
  const filteredData = data.filter(user => 
    user.email?.toLowerCase().includes(filterValue.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(filterValue.toLowerCase()) ||
    user.role?.toLowerCase().includes(filterValue.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="ml-auto w-1/3"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.first_name || "-"}</TableCell>
                  <TableCell>{user.last_name || "-"}</TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell className="capitalize">{user.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(user.id);
                              toast.success("User ID copied to clipboard");
                            }}
                          >
                            Copy User ID
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                            Set as Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, "member")}>
                            Set as Member
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                            Set Active
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                            Set Inactive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/members/${user.id}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Handle role change
  async function handleRoleChange(userId: string, newRole: string) {
    try {
      const success = await updateUserRole(userId, newRole);
      if (success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers(); // Refresh user data
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update user role");
    }
  }

  // Handle status change
  async function handleStatusChange(userId: string, newStatus: string) {
    try {
      const success = await updateUserStatus(userId, newStatus);
      if (success) {
        toast.success(`User status updated to ${newStatus}`);
        fetchUsers(); // Refresh user data
      } else {
        throw new Error("Failed to update user status");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    }
  }
}
