
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, UserPlus, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useUserManagement } from "@/hooks/user/useUserManagement";
import { MembersList } from "@/components/members/MembersList";
import { useMedia } from "@/hooks/use-mobile";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { User } from "@/hooks/user/useUserManagement";
import { Separator } from "@/components/ui/separator";
import { createMemberRefreshFunction } from "@/components/members/MembersPageRefactor";

/**
 * Member Directory Page
 * This is the general member directory available to all authenticated users
 * with simplified management capabilities compared to the admin version
 */
export default function MemberDirectoryPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [memberToDeleteName, setMemberToDeleteName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const isMobile = useMedia('(max-width: 640px)');
  const { hasPermission } = usePermissions();
  
  // Making this always true so the Add Member button is always shown
  // We'll temporarily bypass permission checks
  const canManageMembers = true;
  
  const {
    users: allMembers,
    isLoading,
    fetchUsers,
    addUser,
    deleteUser
  } = useUserManagement();
  
  // Filter out deleted users
  const members = allMembers.filter(member => member.status !== 'deleted');
  
  // Fetch members on component mount
  useEffect(() => {
    console.log("MemberDirectoryPage - Fetching users");
    fetchUsers().catch(err => {
      console.error("Error fetching users:", err);
      toast.error("Failed to load members");
    });
  }, [fetchUsers]);

  // Handle adding a new member
  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        setIsAddMemberDialogOpen(false);
        toast.success(`Added ${data.first_name} ${data.last_name}`);
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modified to work with both User objects and string IDs
  const handleDeleteClick = (memberIdOrObject: string | User) => {
    console.log("Requesting delete for member:", memberIdOrObject);
    let memberId: string;
    let member: User | undefined;
    
    // Check if we received a string ID or User object
    if (typeof memberIdOrObject === 'string') {
      memberId = memberIdOrObject;
      member = members.find(m => m.id === memberId);
    } else {
      // It's a User object
      memberId = memberIdOrObject.id;
      member = memberIdOrObject;
    }
    
    if (member) {
      setMemberToDelete(memberId);
      setMemberToDeleteName(`${member.first_name || ''} ${member.last_name || ''}`.trim() || 'this member');
      setIsDeleteDialogOpen(true);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    
    setIsDeleting(true);
    try {
      if (deleteUser) {
        await deleteUser(memberToDelete);
        setIsDeleteDialogOpen(false);
        setMemberToDelete(null);
        toast.success(`${memberToDeleteName} has been removed from the member list`);
        // Refresh the list after deletion
        await fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      toast.error("Failed to delete member");
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
    setActiveTab("all");
  };

  // Filter members based on search query and filters
  const filteredMembers = React.useMemo(() => {
    return members.filter(member => {
      // First apply search filter
      const matchesSearch = 
        !searchQuery || 
        (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;
      
      // Then apply dropdown filters
      const matchesRole = roleFilter === "all" || (member.role || '') === roleFilter;
      const matchesStatus = statusFilter === "all" || (member.status || '') === statusFilter;
      
      if (!matchesRole || !matchesStatus) return false;
      
      // Then apply tab filter
      if (activeTab === "all") return true;
      if (activeTab === "active" && member.status === "active") return true;
      if (activeTab === "inactive" && member.status !== "active") return true;
      
      return false;
    });
  }, [members, searchQuery, roleFilter, statusFilter, activeTab]);

  // Create a wrapper function for fetchUsers that returns void
  const refreshMembers = createMemberRefreshFunction(fetchUsers);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <PageHeader
          title="Glee Club Members"
          description="View and connect with Spelman College Glee Club members"
          icon={<Users className="h-6 w-6" />}
        />
        
        {hasPermission('can_manage_users') && (
          <Link to="/dashboard/admin/members">
            <Button 
              variant="secondary" 
              className="mt-4 sm:mt-0"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced Member Management
            </Button>
          </Link>
        )}
      </div>
      
      <div className="flex flex-col gap-4">
        {/* Tabs navigation for quick filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All Members</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            {/* Show Add Member button for all users */}
            <Button 
              onClick={() => setIsAddMemberDialogOpen(true)}
              className="bg-brand hover:bg-brand/90"
              size={isMobile ? "sm" : "default"}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              {isMobile ? 'Add' : 'Add Member'}
            </Button>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between gap-4 items-end">
                  {/* Search and filter controls */}
                  <div className="flex-1 flex flex-col sm:flex-row gap-2 w-full">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search members..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetFilters}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Member count summary */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {filteredMembers.length === members.length ? (
                      <span>Showing all {members.length} members</span>
                    ) : (
                      <span>Showing {filteredMembers.length} of {members.length} members</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-background text-foreground">
                      Active: {members.filter(m => m.status === 'active').length}
                    </Badge>
                    <Badge variant="outline" className="bg-background text-foreground">
                      Pending: {members.filter(m => m.status === 'pending').length}
                    </Badge>
                  </div>
                </div>
                
                {/* Display loading state, empty state, or member list */}
                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-muted-foreground mb-4">No members found matching your criteria.</p>
                    <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                  </div>
                ) : (
                  <MembersList 
                    members={filteredMembers} 
                    onEditMember={handleDeleteClick}
                    onDeleteMember={handleDeleteClick}
                  />
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <Card className="p-4">
              {/* Same filter controls and member list as the "all" tab but with activeTab="active" */}
              <p className="text-muted-foreground">Showing only active members</p>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <MembersList 
                  members={filteredMembers} 
                  onEditMember={handleDeleteClick}
                  onDeleteMember={handleDeleteClick}
                />
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            <Card className="p-4">
              {/* Same filter controls and member list as the "all" tab but with activeTab="inactive" */}
              <p className="text-muted-foreground">Showing pending, inactive, and alumni members</p>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                </div>
              ) : (
                <MembersList 
                  members={filteredMembers} 
                  onEditMember={handleDeleteClick}
                  onDeleteMember={handleDeleteClick}
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Member Dialog - Available to all users now */}
      <AddMemberDialog
        isOpen={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onMemberAdd={handleAddMember}
        isSubmitting={isSubmitting}
      />
      
      {/* Delete Member Dialog */}
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        memberName={memberToDeleteName}
        isDeleting={isDeleting}
      />
    </div>
  );
}
