
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
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
import { User } from "@/hooks/useUserManagement";
import { UserTitleManagement } from "@/components/admin/UserTitleManagement";
import { toast } from "sonner";

// Format voice part for display
const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "N/A";
  
  const parts: {[key: string]: string} = {
    soprano_1: "Soprano 1",
    soprano_2: "Soprano 2",
    alto_1: "Alto 1",
    alto_2: "Alto 2",
    tenor: "Tenor",
    bass: "Bass"
  };
  
  return parts[voicePart] || voicePart;
};

// Format role for display
const formatRole = (role: string): string => {
  const roles: {[key: string]: string} = {
    administrator: "Administrator",
    section_leader: "Section Leader",
    singer: "Singer",
    student_conductor: "Student Conductor",
    accompanist: "Accompanist",
    non_singer: "Non-Singer"
  };
  
  return roles[role] || role;
};

export default function AdminMembersPage() {
  const { isAdmin, isLoading: authLoading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isManageRoleOpen, setIsManageRoleOpen] = useState(false);

  // Fetch members
  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setMembers(data as User[]);
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        toast.error('Failed to load members');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchMembers();
  }, []);

  // Handle refresh after role update
  const handleRoleUpdateSuccess = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setMembers(data as User[]);
        toast.success("Member list refreshed");
      }
    } catch (error) {
      console.error('Error refreshing members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is not authenticated or not an admin
  if (!authLoading && (!isAuthenticated || !isAdmin())) {
    return <Navigate to="/dashboard" />;
  }
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter members based on search query
  const filteredMembers = members.filter(member => 
    (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (member.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open role management dialog
  const openRoleManagement = (user: User) => {
    setSelectedUser(user);
    setIsManageRoleOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Member Management"
        description="View and manage all Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Voice Part</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.first_name} {member.last_name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatRole(member.role || '')}</TableCell>
                  <TableCell>
                    {member.title || 'General Member'}
                  </TableCell>
                  <TableCell>{formatVoicePart(member.voice_part || null)}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {(member.status || 'pending').charAt(0).toUpperCase() + (member.status || 'pending').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.is_super_admin ? (
                      <Badge variant="outline" className="bg-primary-50 text-primary border-primary-200">
                        Super Admin
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openRoleManagement(member)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Manage Title & Role
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Change Voice Part</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No members found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Role Management Dialog */}
      <UserTitleManagement
        user={selectedUser}
        isOpen={isManageRoleOpen}
        setIsOpen={setIsManageRoleOpen}
        onSuccess={handleRoleUpdateSuccess}
      />
    </div>
  );
}
