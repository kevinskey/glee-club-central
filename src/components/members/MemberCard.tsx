
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Profile, UserRole, MemberStatus, VoicePart } from "@/contexts/AuthContext";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@/hooks/useUserManagement";

interface MemberCardProps {
  member: Profile | User;
}

export function MemberCard({ member }: MemberCardProps) {
  // Function to safely cast the member to a Profile type
  const asProfile = (member: Profile | User): Profile => {
    return {
      ...member,
      role: member.role as UserRole,
      status: member.status as MemberStatus,
      voice_part: member.voice_part as VoicePart,
    };
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle>{member.first_name} {member.last_name}</CardTitle>
        <CardDescription>{member.role}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p>Email: {member.email}</p>
        <p>Voice Part: {member.voice_part || 'Not Assigned'}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link to={`/dashboard/members/${member.id}`}>
          <Button variant="outline" size="sm">View Profile</Button>
        </Link>
        <Link to={`/dashboard/members/edit/${member.id}`}>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
