
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, RefreshCcw, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function MemberDirectoryPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const {
    users,
    isLoading,
    fetchUsers,
    changeUserStatus,
    activateUser
  } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Filter users when dependencies change
  useEffect(() => {
    console.log("Users in MemberDirectoryPage:", users); // Debug log
    
    const filtered = users.filter(user => {
      // Search filter - check each field that might contain the search term
      const matchesSearch = searchTerm === "" || 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Role filter
      const matchesRole = roleFilter === "" || user.role === roleFilter;
      
      // Status filter
      const matchesStatus = statusFilter === "" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'alumni':
        return <Badge variant="outline">Alumni</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return "Administrator";
      case 'section_leader':
        return "Section Leader";
      case 'student_conductor':
        return "Student Conductor";
      case 'accompanist':
        return "Accompanist";
      case 'singer':
        return "Singer";
      case 'member':
        return "Member";
      default:
        return role;
    }
  };
  
  // Handle activating a pending user
  const handleActivateUser = async (userId: string) => {
    try {
      await activateUser(userId);
      toast.success("User activated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to activate user");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Directory"
        description="View all members and their information"
        icon={<Users className="h-6 w-6" />}
      />

      <Card className="p-6">
        <CardContent className="p-0 pt-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Search and filters */}
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="admin">Administrators</SelectItem>
                  <SelectItem value="section_leader">Section Leaders</SelectItem>
                  <SelectItem value="student_conductor">Student Conductors</SelectItem>
                  <SelectItem value="accompanist">Accompanists</SelectItem>
                  <SelectItem value="singer">Singers</SelectItem>
                  <SelectItem value="member">Regular Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[150px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              onClick={fetchUsers}
              className="flex-shrink-0"
              disabled={isLoading}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                <p>Loading members...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No members found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        {user.first_name || ''} {user.last_name || ''}
                      </td>
                      <td className="py-3 px-4">{user.email || 'No email'}</td>
                      <td className="py-3 px-4">{getRoleDisplay(user.role)}</td>
                      <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {user.status === 'pending' && isAdmin() && (
                            <Button 
                              size="sm" 
                              className="h-8 bg-green-600 hover:bg-green-700"
                              onClick={() => handleActivateUser(user.id)}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Activate
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => navigate(`/dashboard/members/${user.id}`)}
                          >
                            View Profile
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            {filteredUsers.length} member{filteredUsers.length !== 1 ? 's' : ''} found
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
