import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  FilterFn,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Define a custom filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
  if (!value) {
    return true;
  }

  const cellValue = row.getValue(columnId);
  if (typeof cellValue !== "string") {
    return false;
  }

  const searchTerm = value.toLowerCase();
  const sourceValue = cellValue.toLowerCase();

  // Simple fuzzy matching logic
  let searchIndex = 0;
  for (let i = 0; i < sourceValue.length; i++) {
    if (sourceValue[i] === searchTerm[searchIndex]) {
      searchIndex++;
    }
    if (searchIndex === searchTerm.length) {
      return true;
    }
  }

  return false;
};

interface UsersTableProps {
  data: User[];
  fetchUsers: () => Promise<void>;
}

export function UsersTable({ data, fetchUsers }: UsersTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "first_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            First Name
            <ArrowUp className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "last_name",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        const [open, setOpen] = useState(false);
        const [role, setRole] = useState(user.role);
        const [status, setStatus] = useState(user.status);
        const [isUpdating, setIsUpdating] = useState(false);

        const handleRoleChange = async (newRole: string) => {
          setIsUpdating(true);
          try {
            const success = await updateUserRole(user.id, newRole);
            if (success) {
              setRole(newRole);
              toast.success(`User role updated to ${newRole}`);
              fetchUsers(); // Refresh user data
            } else {
              throw new Error("Failed to update user role");
            }
          } catch (err: any) {
            toast.error(err.message || "Failed to update user role");
          } finally {
            setIsUpdating(false);
          }
        };

        const handleStatusChange = async (newStatus: string) => {
          setIsUpdating(true);
          try {
            const success = await updateUserStatus(user.id, newStatus);
            if (success) {
              setStatus(newStatus);
              toast.success(`User status updated to ${newStatus}`);
              fetchUsers(); // Refresh user data
            } else {
              throw new Error("Failed to update user status");
            }
          } catch (err: any) {
            toast.error(err.message || "Failed to update user status");
          } finally {
            setIsUpdating(false);
          }
        };

        return (
          <>
            <AlertDialog open={open} onOpenChange={setOpen}>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <AlertDialogTrigger>Delete</AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this user and all of their data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  Change Role
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select a new role</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleRoleChange("admin")}
                  disabled={isUpdating}
                >
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange("section_leader")}
                  disabled={isUpdating}
                >
                  Section Leader
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange("member")}
                  disabled={isUpdating}
                >
                  Member
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange("singer")}
                  disabled={isUpdating}
                >
                  Singer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange("Director")}
                  disabled={isUpdating}
                >
                  Director
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleRoleChange("Accompanist")}
                  disabled={isUpdating}
                >
                  Accompanist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-2">
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select a new status</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdating}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("inactive")}
                  disabled={isUpdating}
                >
                  Inactive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("pending")}
                  disabled={isUpdating}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusChange("alumni")}
                  disabled={isUpdating}
                >
                  Alumni
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
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    onStateChange: (updater) => {
      if (typeof updater === 'function') {
        // Apply the update and return the NEW state
        return updater(table.getState());
      } else {
        // Just return the NEW partial state
        return updater;
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (sorting) => setSorting(sorting),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sorting,
      globalFilter: globalFilter,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="ml-auto w-1/3"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
