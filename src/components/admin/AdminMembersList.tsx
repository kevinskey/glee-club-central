
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Member {
  id: string;
  name: string;
  role: string;
  voicePart: string;
  duesPaid: boolean;
  avatarUrl?: string;
}

interface AdminMembersListProps {
  members: Member[];
}

export function AdminMembersList({ members }: AdminMembersListProps) {
  const navigate = useNavigate();
  
  if (members.length === 0) {
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.slice(0, 5).map((member) => (
            <div 
              key={member.id} 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => navigate(`/dashboard/admin/members/${member.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.voicePart || member.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={member.duesPaid ? "default" : "destructive"}>
                  {member.duesPaid ? "Dues Paid" : "Unpaid"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
