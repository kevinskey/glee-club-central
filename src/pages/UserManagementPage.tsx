import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, UserCheck, UserX, UserCog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserManagementPage() {
  const { isAdmin } = useAuth();
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    isUpdating,
    fetchUsers,
    changeUserRole,
    changeUserStatus
  } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Handle unauthorized access
  if (!isAdmin()) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <UserX className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }
  
  // Filter users
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Role filter
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "alumni":
        return <Badge className="bg-blue-500">Alumni</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>;
      case "section_leader":
        return <Badge className="bg-blue-500">Section Leader</Badge>;
      case "member":
        return <Badge variant="outline">Member</Badge>;
      case "student_conductor":
        return <Badge className="bg-green-500">Student Conductor</Badge>;
      case "accompanist":
        return <Badge className="bg-amber-500">Accompanist</Badge>;
      case "singer":
        return <Badge className="bg-sky-500">Singer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  // Handle role change
  const handleRoleChange = async (userId: string, role: string) => {
    await changeUserRole(userId, role);
  };
  
  // Handle status change
  const handleStatusChange = async (userId: string, status: string) => {
    await changeUserStatus(userId, status);
  };
  
  // View user details
  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all users in the system"
        icon={<UserCog className="h-6 w-6" />}
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                onClick={fetchUsers}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <Select
                value={roleFilter}
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="section_leader">Section Leader</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                  <SelectItem value="Accompanist">Accompanist</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Join Date</TableHead>
                  <TableHead className="hidden md:table-cell">Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                        <p>Loading users...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                            ) : (
                              <AvatarFallback>
                                {user.first_name?.[0]}{user.last_name?.[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{`${user.first_name || ''} ${user.last_name || ''}`}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(user.join_date)}</TableCell>
                      <TableCell className="hidden md:table-cell">{formatDate(user.last_sign_in_at)}</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => viewUserDetails(user)}>
                              Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            {selectedUser && (
                              <>
                                <SheetHeader>
                                  <SheetTitle>User Details</SheetTitle>
                                </SheetHeader>
                                
                                <div className="mt-6 space-y-6">
                                  <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                      {selectedUser.avatar_url ? (
                                        <AvatarImage src={selectedUser.avatar_url} />
                                      ) : (
                                        <AvatarFallback className="text-lg">
                                          {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                                        </AvatarFallback>
                                      )}
                                    </Avatar>
                                    
                                    <div>
                                      <h3 className="text-xl font-medium">
                                        {selectedUser.first_name} {selectedUser.last_name}
                                      </h3>
                                      <p className="text-muted-foreground">{selectedUser.email}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium">Role</p>
                                        <Select
                                          value={selectedUser.role}
                                          onValueChange={(value) => {
                                            handleRoleChange(selectedUser.id, value);
                                          }}
                                          disabled={isUpdating}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
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
                                          value={selectedUser.status}
                                          onValueChange={(value) => {
                                            handleStatusChange(selectedUser.id, value);
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
                                      <p className="text-sm">{selectedUser.voice_part || "Not set"}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <p className="text-sm font-medium">Phone</p>
                                      <p className="text-sm">{selectedUser.phone || "Not provided"}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Join Date</p>
                                        <p className="text-sm">{formatDate(selectedUser.join_date)}</p>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium">Last Login</p>
                                        <p className="text-sm">{formatDate(selectedUser.last_sign_in_at)}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </SheetContent>
                        </Sheet>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="ml-2">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "admin")}>
                              Set as Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "section_leader")}>
                              Set as Section Leader
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "student_conductor")}>
                              Set as Student Conductor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "accompanist")}>
                              Set as Accompanist
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "singer")}>
                              Set as Singer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "member")}>
                              Set as Member
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                              Set Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "inactive")}>
                              Set Inactive
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, "alumni")}>
                              Set Alumni
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
          
          <div className="mt-4 text-sm text-gray-500">
            Total: {users.filter(user => {
              // Search filter
              const matchesSearch = searchTerm === "" || 
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
                
              // Role filter
              const matchesRole = roleFilter === "all" || user.role === roleFilter;
              
              // Status filter
              const matchesStatus = statusFilter === "all" || user.status === statusFilter;
              
              return matchesSearch && matchesRole && matchesStatus;
            }).length} users
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
