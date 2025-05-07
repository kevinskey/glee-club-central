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
import { toast } from "sonner";
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
  const [classYearFilter, setClassYearFilter] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
  
  // Available class years (dynamically generated from users data)
  const classYears = Array.from(
    new Set(
      users
        .map(user => user.class_year)
        .filter(Boolean)
        .sort((a, b) => Number(b) - Number(a))
    )
  );
  
  // Filter users when dependencies change
  useEffect(() => {
    const filtered = users.filter(user => {
      // Only show active users in the directory by default
      if (user.status === 'deleted') return false;
      
      // Search filter - check each field that might contain the search term
      const matchesSearch = searchTerm === "" || 
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      // Voice part filter
      const matchesVoicePart = voicePartFilter === "all" || user.voice_part === voicePartFilter;
      
      // Status filter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      // Class year filter
      const matchesClassYear = classYearFilter === "all" || user.class_year === classYearFilter;
      
      return matchesSearch && matchesRole && matchesVoicePart && matchesStatus && matchesClassYear;
    });
    
    // Sort by last name
    const sorted = [...filtered].sort((a, b) => {
      return (a.last_name || '').localeCompare(b.last_name || '');
    });
    
    setFilteredUsers(sorted);
  }, [users, searchTerm, roleFilter, voicePartFilter, statusFilter, classYearFilter]);
  
  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
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
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setVoicePartFilter("all");
    setStatusFilter("all");
    setClassYearFilter("all");
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
    <div className="container mx-auto px-4 py-6">
      <PageHeader
        title="Member Directory"
        description="View and manage all Glee Club members"
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
                    <DropdownMenuItem onClick={() => setStatusFilter("alumni")}>
                      Alumni
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("on_leave")}>
                      On Leave
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
                  </DropdownMenuGroup>
                  
                  {classYears.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Class Year</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setClassYearFilter("all")}>
                          All Years
                        </DropdownMenuItem>
                        {classYears.map(year => (
                          <DropdownMenuItem key={year} onClick={() => setClassYearFilter(year)}>
                            {year}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={resetFilters}>
                    Reset All Filters
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {isAdmin && (
                <Button onClick={() => navigate("/dashboard/members/add")}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} members
              {/* Display active filters */}
              {(roleFilter !== "all" || voicePartFilter !== "all" || statusFilter !== "all" || classYearFilter !== "all") && (
                <span className="ml-2">
                  (Filtered by: 
                  {roleFilter !== "all" && <span className="ml-1">Role</span>}
                  {voicePartFilter !== "all" && <span className="ml-1">Voice</span>}
                  {statusFilter !== "all" && <span className="ml-1">Status</span>}
                  {classYearFilter !== "all" && <span className="ml-1">Year</span>}
                  )
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={displayMode === "grid" ? "default" : "outline"}
                onClick={() => setDisplayMode("grid")}
              >
                Grid
              </Button>
              <Button
                size="sm"
                variant={displayMode === "list" ? "default" : "outline"}
                onClick={() => setDisplayMode("list")}
              >
                List
              </Button>
            </div>
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
              {(roleFilter !== "all" || voicePartFilter !== "all" || statusFilter !== "all" || classYearFilter !== "all" || searchTerm !== "") && (
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className={displayMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-4"}>
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
