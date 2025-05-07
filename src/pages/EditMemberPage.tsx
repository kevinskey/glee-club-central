
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "@/utils/supabase/users";
import { Profile } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { EditMemberForm } from "@/components/members/EditMemberForm";
import { useMemberEdit, EditMemberFormValues } from "@/hooks/use-member-edit";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function EditMemberPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isEditing, setIsEditing, isLoading, editMember } = useMemberEdit();
  
  // Fetch the member details
  const { 
    data: member, 
    isLoading: isLoadingMember,
    error,
    refetch
  } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchUserById(id as string),
    enabled: !!id,
  });
  
  const handleSubmit = async (data: EditMemberFormValues) => {
    if (!id) return;
    
    await editMember(id, data, (updatedMember) => {
      // After successful update
      refetch();
      // Navigate back to member profile
      navigate(`/dashboard/members/${id}`);
    });
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
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Member not found</h2>
        <p className="text-gray-500 mb-4">Could not find the requested member.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
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
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
