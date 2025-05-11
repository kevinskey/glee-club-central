import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Plus, Search, Filter, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { UserRoleSelector } from "@/components/members/UserRoleSelector";
import { User, useUserManagement } from "@/hooks/useUserManagement";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormValues } from "@/components/members/form/userFormSchema";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserManagementState {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
  selectedUser: User | null;
  isRoleDialogOpen: boolean;
  isAddUserDialogOpen: boolean;
}

export default function UserManagementPage() {
  const { addUser, fetchUsers } = useUserManagement();
  const [state, setState] = useState<UserManagementState>({
    users: [],
    isLoading: true,
    searchQuery: "",
    roleFilter: "all",
    statusFilter: "all",
    selectedUser: null,
    isRoleDialogOpen: false,
    isAddUserDialogOpen: false
  });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "singer",
      voice_part: "soprano_1",
      status: "active"
    }
  });
  
  // Fetch users
  const loadUsers = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setState(prev => ({ ...prev, users: data as User[] }));
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search query and filters
  const filteredUsers = state.users.filter(user => {
    const matchesSearch = 
      (user.first_name || '').toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (user.last_name || '').toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(state.searchQuery.toLowerCase());
    
    const matchesRole = state.roleFilter === "all" || user.role === state.roleFilter;
    const matchesStatus = state.statusFilter === "all" || user.status === state.statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handler for adding a new user by admin
  const handleAddUser = async (values: UserFormValues) => {
    try {
      const success = await addUser(values);
      if (success) {
        toast.success(`Added ${values.first_name} ${values.last_name}`);
        form.reset();
        setState(prev => ({ ...prev, isAddUserDialogOpen: false }));
        loadUsers();
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user");
    }
  };

  // Change user role, status, etc.
  const openRoleDialog = (user: User) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      isRoleDialogOpen: true
    }));
  };

  // Change user status
  const changeUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`User status updated to ${newStatus}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  // Format last login time
  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never";
    try {
      return formatDistanceToNow(new Date(lastLogin), { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="User Management"
        description="View and manage all users"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between">
          <div className="flex flex-1 gap-2 items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="max-w-sm"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <select
              className="border rounded p-2 text-sm"
              value={state.roleFilter}
              onChange={(e) => setState(prev => ({ ...prev, roleFilter: e.target.value }))}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="general">General</option>
            </select>
            
            <select
              className="border rounded p-2 text-sm"
              value={state.statusFilter}
              onChange={(e) => setState(prev => ({ ...prev, statusFilter: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <Button variant="outline" onClick={() => fetchUsers()}>
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button onClick={() => setState(prev => ({ ...prev, isAddUserDialogOpen: true }))}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === 'admin' ? "default" : "outline"}
                      >
                        {user.role === 'admin' ? 'Admin' : 'General'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === 'active' ? "success" : "secondary"}
                      >
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatLastLogin(user.last_login)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openRoleDialog(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => changeUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}>
                            {user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete User
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
      </Card>
      
      {/* User Role Dialog */}
      <UserRoleSelector
        user={state.selectedUser}
        isOpen={state.isRoleDialogOpen}
        onOpenChange={(isOpen) => setState(prev => ({ ...prev, isRoleDialogOpen: isOpen }))}
        onSuccess={loadUsers}
      />

      {/* Add User Dialog - Comprehensive form for admin user creation */}
      <Dialog open={state.isAddUserDialogOpen} onOpenChange={(open) => setState(prev => ({ ...prev, isAddUserDialogOpen: open }))}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user with full attributes and role selection
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="singer">Singer</SelectItem>
                          <SelectItem value="section_leader">Section Leader</SelectItem>
                          <SelectItem value="student_conductor">Student Conductor</SelectItem>
                          <SelectItem value="accompanist">Accompanist</SelectItem>
                          <SelectItem value="non_singer">Non-Singer</SelectItem>
                          <SelectItem value="administrator">Administrator</SelectItem>
                          <SelectItem value="director">Director</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voice_part"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voice Part</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select voice part" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="soprano_1">Soprano 1</SelectItem>
                          <SelectItem value="soprano_2">Soprano 2</SelectItem>
                          <SelectItem value="alto_1">Alto 1</SelectItem>
                          <SelectItem value="alto_2">Alto 2</SelectItem>
                          <SelectItem value="tenor">Tenor</SelectItem>
                          <SelectItem value="bass">Bass</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="class_year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Year</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setState(prev => ({ ...prev, isAddUserDialogOpen: false }))}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
