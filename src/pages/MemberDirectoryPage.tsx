
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, UserPlus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useUserManagement, User } from "@/hooks/useUserManagement";
import { MemberCard } from "@/components/members/MemberCard";
import { Profile, UserRole, MemberStatus, VoicePart } from "@/contexts/AuthContext";

export default function MemberDirectoryPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const {
    users,
    isLoading,
    fetchUsers,
    activateUser
  } = useUserManagement();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [voicePartFilter, setVoicePartFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Fetch users when component mounts
  useEffect(() => {
    console.log("MemberDirectoryPage: Fetching users");
    fetchUsers();
  }, [fetchUsers]);
  
  // Filter users when dependencies change
  useEffect(() => {
    console.log("MemberDirectoryPage: Filtering users", users.length);
    
    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    const filtered = users.filter(user => {
      // Search filter - check name and email fields
      const searchMatch = 
        searchTerm === "" || 
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Role filter
      const roleMatch = roleFilter === "all" || user.role === roleFilter;
      
      // Voice part filter
      const voiceMatch = voicePartFilter === "all" || user.voice_part === voicePartFilter;
      
      // Status filter
      const statusMatch = statusFilter === "all" || user.status === statusFilter;
      
      return searchMatch && roleMatch && voiceMatch && statusMatch;
    });
    
    console.log("MemberDirectoryPage: Filtered users", filtered.length);
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, voicePartFilter, statusFilter]);
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setVoicePartFilter("all");
    setStatusFilter("all");
  };

  // Type conversion function to safely cast User to Profile
  const convertUserToProfile = (user: User): Profile => {
    return {
      ...user,
      role: user.role as UserRole,
      status: user.status as MemberStatus, 
      voice_part: user.voice_part as VoicePart,
    };
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Member Directory"
        description="View all Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />

      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative w-full">
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter Members</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Voice Part</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("all")}>
                      All Voice Parts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("soprano_1")}>
                      Soprano 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("soprano_2")}>
                      Soprano 2
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("alto_1")}>
                      Alto 1
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("alto_2")}>
                      Alto 2
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("tenor")}>
                      Tenor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVoicePartFilter("bass")}>
                      Bass
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Status</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("alumni")}>
                      Alumni
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Role</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                      All Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("singer")}>
                      Singer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("section_leader")}>
                      Section Leader
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("student_conductor")}>
                      Student Conductor
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("accompanist")}>
                      Accompanist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRoleFilter("administrator")}>
                      Administrator
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={resetFilters}>
                    Reset Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {isAdmin() && (
                <Button onClick={() => navigate("/dashboard/members/add")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="flex flex-col items-center">
                <Spinner size="lg" />
                <p className="mt-4">Loading members...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No members found matching your criteria</p>
              {(roleFilter !== "all" || voicePartFilter !== "all" || statusFilter !== "all" || searchTerm !== "") && (
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredUsers.map(member => (
                <MemberCard
                  key={member.id}
                  member={convertUserToProfile(member)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
