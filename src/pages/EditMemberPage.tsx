
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/utils/supabase/users";
import { Profile, UserRole, MemberStatus, VoicePart } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { EditMemberForm } from "@/components/members/EditMemberForm";
import { useMemberEdit, EditMemberFormValues } from "@/hooks/use-member-edit";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isEditing, setIsEditing, isLoading: isSaving, editMember } = useMemberEdit();
  
  // Fetch the member details with better error handling
  const { 
    data: memberData, 
    isLoading: isLoadingMember,
    error,
    refetch
  } = useQuery({
    queryKey: ['member', id],
    queryFn: async () => {
      if (!id) throw new Error("No member ID provided");
      try {
        const data = await fetchUserById(id);
        console.log("Fetched member data:", data);
        return data;
      } catch (err) {
        console.error("Error fetching member:", err);
        throw err;
      }
    },
    enabled: !!id,
    retry: 1,
  });
  
  // Convert the fetched data to a Profile type
  const member: Profile | null = memberData ? {
    ...memberData,
    role: memberData.role as UserRole,
    status: memberData.status as MemberStatus,
    voice_part: memberData.voice_part as VoicePart
  } : null;
  
  const handleSubmit = async (data: EditMemberFormValues) => {
    if (!id) {
      toast.error("Missing member ID");
      return;
    }
    
    console.log("Submitting member update:", data);
    
    try {
      await editMember(id, data, (updatedMember) => {
        // After successful update
        toast.success("Member updated successfully");
        refetch();
        // Navigate back to member profile
        navigate(`/dashboard/members/${id}`);
      });
    } catch (error: any) {
      console.error("Error updating member:", error);
      toast.error(`Failed to update member: ${error.message || "Unknown error"}`);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  if (isLoadingMember) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">Error loading member</h2>
        <p className="text-gray-500 mb-4">There was a problem loading the member details.</p>
        <p className="text-sm text-red-500 mb-4">{(error as Error).message}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button onClick={() => refetch()} className="ml-2">Try Again</Button>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Member not found</h2>
        <p className="text-gray-500 mb-4">Could not find the requested member with ID: {id}</p>
        <p className="text-sm mb-4">The member might not exist or you don't have permission to view it.</p>
        <Button onClick={() => navigate("/dashboard/member-directory")}>Back to Directory</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <PageHeader
        title={`Edit Member: ${member.first_name} ${member.last_name}`}
        description="Update member information"
        icon={<User className="h-6 w-6" />}
      />
      
      <EditMemberForm
        member={member}
        isLoading={isSaving}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
