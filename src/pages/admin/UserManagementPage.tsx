
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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  last_login: string | null;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setUsers(data as User[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Change user role
  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) {
        throw error;
      }
      
      toast.success(`User role updated to ${newRole}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <select
              className="border rounded p-2 text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="general">General</option>
            </select>
            
            <select
              className="border rounded p-2 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <Button variant="outline" onClick={() => fetchUsers()}>
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button>
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
              {isLoading ? (
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
                          <DropdownMenuItem onClick={() => changeUserRole(user.id, user.role === 'admin' ? 'general' : 'admin')}>
                            <UserCog className="mr-2 h-4 w-4" />
                            {user.role === 'admin' ? 'Remove Admin Role' : 'Make Admin'}
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
    </div>
  );
}
