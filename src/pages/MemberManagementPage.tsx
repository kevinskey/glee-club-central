
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, UserCog, Shield, UserX } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { MemberTable } from "@/components/members/MemberTable";
import { MemberFilterBar } from "@/components/members/MemberFilterBar";
import { Button } from "@/components/ui/button";
import { useMemberManagement } from "@/hooks/useMemberManagement";
import { Pagination } from "@/components/ui/pagination";
import { EditMemberDrawer } from "@/components/members/EditMemberDrawer";
import { DeleteMemberDialog } from "@/components/members/DeleteMemberDialog";
import { toast } from "sonner";

export default function MemberManagementPage() {
  const { isAdmin } = useAuth();
  const { 
    members,
    filteredMembers,
    isLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortConfig,
    setSortConfig,
    pagination,
    setPagination,
    refreshMembers,
    activateMember
  } = useMemberManagement();
  
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  
  // Handle opening the edit drawer
  const handleEditMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsEditDrawerOpen(true);
  };
  
  // Handle opening the delete dialog
  const handleDeletePrompt = (memberId: string) => {
    setSelectedMemberId(memberId);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle activating a pending user
  const handleActivateUser = async (userId: string) => {
    try {
      await activateMember(userId);
      toast.success("Member activated successfully");
      refreshMembers();
    } catch (error) {
      console.error("Error activating member:", error);
      toast.error("Failed to activate member");
    }
  };
  
  // If not admin, show access denied
  if (!isAdmin()) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-6 w-6 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Please contact an administrator if you believe you should have access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Management"
        description="Manage your glee club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {filteredMembers.length} members found
            </CardDescription>
          </div>
          <Button onClick={refreshMembers} disabled={isLoading} variant="outline">
            Refresh
          </Button>
        </CardHeader>
        
        <CardContent>
          <MemberFilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <div className="mt-6 rounded-md border">
            <MemberTable 
              filteredMembers={filteredMembers}
              isLoading={isLoading}
              handleEditMember={handleEditMember}
              handleDeletePrompt={handleDeletePrompt}
              handleActivateUser={handleActivateUser}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              isAdmin={isAdmin()}
            />
          </div>
          
          {filteredMembers.length > pagination.pageSize && (
            <CardFooter className="flex justify-end pt-6">
              <Pagination>
                {/* Pagination content will go here */}
              </Pagination>
            </CardFooter>
          )}
        </CardContent>
      </Card>
      
      <EditMemberDrawer 
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        memberId={selectedMemberId}
        onSuccess={() => {
          setIsEditDrawerOpen(false);
          refreshMembers();
        }}
      />
      
      <DeleteMemberDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        memberId={selectedMemberId}
        onSuccess={() => {
          setIsDeleteDialogOpen(false);
          refreshMembers();
        }}
      />
    </div>
  );
}
