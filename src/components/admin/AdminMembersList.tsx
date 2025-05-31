
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { User } from "@/hooks/user/useUserManagement";
import { formatVoicePart } from "@/components/members/formatters/memberFormatters";

interface AdminMembersListProps {
  members: User[];
  isLoading?: boolean;
}

export function AdminMembersList({ members, isLoading = false }: AdminMembersListProps) {
  const navigate = useNavigate();
  
  console.log("AdminMembersList rendering with", members?.length || 0, "members");
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-muted"></div>
                  <div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                    <div className="h-3 w-20 mt-2 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!members || members.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No members found</p>
        </CardContent>
      </Card>
    );
  }
  
  // Only show active members in the dashboard preview
  const activeMembers = members.filter(member => member.status === 'active');
  console.log("AdminMembersList active members:", activeMembers.length);
  const recentMembers = activeMembers.slice(0, 5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentMembers.map((member) => (
            <div 
              key={member.id} 
              className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
              onClick={() => navigate(`/dashboard/admin/members/${member.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatar_url || undefined} alt={`${member.first_name} ${member.last_name}`} />
                  <AvatarFallback>
                    {member.first_name?.[0]}{member.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.first_name} {member.last_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatVoicePart(member.voice_part) || member.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.dues_paid ? "default" : "destructive"}>
                  {member.dues_paid ? "Dues Paid" : "Unpaid"}
                </Badge>
              </div>
            </div>
          ))}
          
          {activeMembers.length > 5 && (
            <div className="pt-2 text-center">
              <button 
                className="text-sm text-primary hover:text-primary/80 underline"
                onClick={() => navigate('/dashboard/admin/members')}
              >
                View all {activeMembers.length} active members
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
