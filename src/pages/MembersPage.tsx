
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, Filter, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserManagement } from "@/hooks/useUserManagement";
import { MembersList } from "@/components/members/MembersList";
import { useMedia } from "@/hooks/use-mobile";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { UserFormValues } from "@/components/members/form/userFormSchema";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

export default function MembersPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [voicePartFilter, setVoicePartFilter] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMedia('(max-width: 640px)');
  const { hasPermission } = usePermissions();
  
  const {
    users: members,
    isLoading,
    fetchUsers,
    addUser
  } = useUserManagement();
  
  // Fetch members on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle adding a new member
  const handleAddMember = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await addUser(data);
      if (success) {
        toast.success(`Added ${data.first_name} ${data.last_name} successfully!`);
        setIsAddMemberDialogOpen(false);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter members based on search query and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      (member.first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || (member.role || '') === roleFilter;
    const matchesVoicePart = !voicePartFilter || (member.voice_part || '') === voicePartFilter;
    
    return matchesSearch && matchesRole && matchesVoicePart;
  });

  // Check if user has permission to add members
  const canAddMembers = hasPermission('can_manage_users');

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Glee Club Members"
        description="View all Spelman College Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 items-end">
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("");
                setVoicePartFilter("");
              }}
            >
              Reset
            </Button>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              {isMobile ? '' : 'Filter'}
            </Button>
            
            {canAddMembers && (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setIsAddMemberDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {isMobile ? '' : 'Add Member'}
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <MembersList members={filteredMembers} />
        )}
      </Card>
      
      {/* Add Member Dialog */}
      {canAddMembers && (
        <AddMemberDialog
          isOpen={isAddMemberDialogOpen}
          onOpenChange={setIsAddMemberDialogOpen}
          onMemberAdd={handleAddMember}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
