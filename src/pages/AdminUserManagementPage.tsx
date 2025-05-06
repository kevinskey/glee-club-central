import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { UserCog, UserPlus, Search, Filter, Edit, Trash2, Check, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMessaging } from "@/hooks/useMessaging";
import { createUser, deleteUser } from "@/utils/adminUserOperations";

// User form schema for validation
const userFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  role: z.string(),
  status: z.string(),
  voice_part: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  password: z.string().optional(),
  section_id: z.string().optional().nullable(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function AdminUserManagementPage() {
  const { isAdmin } = useAuth();
  const { sendEmail } = useMessaging();
  const {
    users,
    selectedUser,
    setSelectedUser,
    isLoading,
    isUpdating,
    fetchUsers,
    changeUserRole,
    changeUserStatus,
    getUserDetails
  } = useUserManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Handle unauthorized access
  if (!isAdmin()) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <UserCog className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold">Access Denied</h2>
          <p className="text-muted-foreground">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  // New user form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      role: "member",
      status: "active",
      voice_part: null,
      phone: null,
      password: "",
      section_id: null,
    },
  });

  // Edit user form
  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      role: "member",
      status: "active",
      voice_part: null,
      phone: null,
      password: "",
      section_id: null,
    },
  });

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

  // Handle create user form submission
  const onCreateUserSubmit = async (data: UserFormValues) => {
    try {
      // Generate a temporary random password
      const tempPassword = data.password || Math.random().toString(36).slice(-8);
      
      // Create the user in Supabase
      const result = await createUser({
        email: data.email,
        password: tempPassword,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part || null,
        phone: data.phone || null,
        section_id: data.section_id || null,
      });
      
      if (result.success) {
        // Send welcome email with password reset instructions
        await sendWelcomeEmail(data.email, data.first_name, tempPassword);
        
        toast.success(`User ${data.email} created successfully. Welcome email sent.`);
        
        // Refresh the user list
        fetchUsers();
      }
      
      setIsCreateUserOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Error creating user");
    }
  };

  // Send welcome email to the new user
  const sendWelcomeEmail = async (email: string, firstName: string, tempPassword: string) => {
    try {
      const emailContent = `
        <h2>Welcome to the Spelman College Glee Club!</h2>
        <p>Dear ${firstName},</p>
        <p>You have been added as a member to the Spelman College Glee Club system. To get started, please login using the following temporary password:</p>
        <p><strong>${tempPassword}</strong></p>
        <p>For security reasons, please change your password immediately after your first login.</p>
        <p>If you have any questions, please contact your administrator.</p>
        <p>Best regards,<br>Spelman College Glee Club</p>
      `;
      
      await sendEmail(email, "Welcome to Spelman College Glee Club", emailContent);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // We don't want to stop the flow if email fails, so just log it
      toast.error("User created, but welcome email could not be sent");
    }
  };

  // Handle edit user form submission
  const onEditUserSubmit = async (data: UserFormValues) => {
    try {
      if (!selectedUser) return;
      
      // Update role if changed
      if (data.role !== selectedUser.role) {
        await changeUserRole(selectedUser.id, data.role);
      }
      
      // Update status if changed
      if (data.status !== selectedUser.status) {
        await changeUserStatus(selectedUser.id, data.status);
      }
      
      // Other fields would be updated here
      toast.success(`User ${selectedUser.email} updated`);
      setIsEditUserOpen(false);
      editForm.reset();
    } catch (error: any) {
      toast.error(error.message || "Error updating user");
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    try {
      if (!userToDelete) return;
      
      // Call the deleteUser function
      const result = await deleteUser(userToDelete.id);
      
      if (result.success) {
        toast.success(`User ${userToDelete.email} deleted successfully`);
        fetchUsers(); // Refresh the user list
        setIsDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Error deleting user");
    }
  };

  // Edit user
  const handleEditUser = async (user: User) => {
    setSelectedUser(user);
    
    // Populate form with user data
    editForm.reset({
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role || "member",
      status: user.status || "active",
      voice_part: user.voice_part || null,
      phone: user.phone || null,
      password: "", // Don't populate password
      section_id: user.section_id || null,
    });
    
    setIsEditUserOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="WordPress-style User Management"
        description="Create, edit, and manage users with advanced controls"
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
              <Button onClick={() => setIsCreateUserOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
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
                  <SelectItem value="student_conductor">Student Conductor</SelectItem>
                  <SelectItem value="accompanist">Accompanist</SelectItem>
                  <SelectItem value="singer">Singer</SelectItem>
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
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500"
                            onClick={() => {
                              setUserToDelete(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Total: {filteredUsers.length} users
          </div>
        </CardContent>
      </Card>

      {/* Create User Sheet */}
      <Sheet open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
        <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New User</SheetTitle>
            <SheetDescription>
              Create a new user account. All users will receive an email invitation.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreateUserSubmit)} className="space-y-6 py-6">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
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
                          <Input type="password" placeholder="Create a strong password" {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank to generate a random password
                        </FormDescription>
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
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="section_leader">Section Leader</SelectItem>
                              <SelectItem value="student_conductor">Student Conductor</SelectItem>
                              <SelectItem value="accompanist">Accompanist</SelectItem>
                              <SelectItem value="singer">Singer</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="alumni">Alumni</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
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
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} value={field.value || ''} />
                        </FormControl>
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
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select voice part" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Not specified</SelectItem>
                            <SelectItem value="soprano">Soprano</SelectItem>
                            <SelectItem value="alto">Alto</SelectItem>
                            <SelectItem value="tenor">Tenor</SelectItem>
                            <SelectItem value="bass">Bass</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </SheetClose>
                <Button type="submit">Create User</Button>
              </SheetFooter>
            </form>
          </Form>
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
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditUserSubmit)} className="space-y-6 py-6">
                <Tabs defaultValue="account" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="account" className="space-y-4 mt-4">
                    <FormField
                      control={editForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="user@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Leave blank to keep current password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Only enter a new password if you want to change it
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="section_leader">Section Leader</SelectItem>
                                <SelectItem value="student_conductor">Student Conductor</SelectItem>
                                <SelectItem value="accompanist">Accompanist</SelectItem>
                                <SelectItem value="singer">Singer</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={editForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="alumni">Alumni</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={editForm.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={editForm.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={editForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editForm.control}
                      name="voice_part"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice Part</FormLabel>
                          <Select
                            value={field.value || ''}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voice part" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Not specified</SelectItem>
                              <SelectItem value="soprano">Soprano</SelectItem>
                              <SelectItem value="alto">Alto</SelectItem>
                              <SelectItem value="tenor">Tenor</SelectItem>
                              <SelectItem value="bass">Bass</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <SheetFooter>
                  <SheetClose asChild>
                    <Button variant="outline" type="button">Cancel</Button>
                  </SheetClose>
                  <Button type="submit">Update User</Button>
                </SheetFooter>
              </form>
            </Form>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user
              account and remove their data from our servers.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="flex items-center space-x-3 py-4">
              <Avatar>
                {userToDelete.avatar_url ? (
                  <AvatarImage src={userToDelete.avatar_url} alt={`${userToDelete.first_name} ${userToDelete.last_name}`} />
                ) : (
                  <AvatarFallback>
                    {userToDelete.first_name?.[0]}{userToDelete.last_name?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{`${userToDelete.first_name || ''} ${userToDelete.last_name || ''}`}</p>
                <p className="text-sm text-muted-foreground">{userToDelete.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
