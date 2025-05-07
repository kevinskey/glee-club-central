
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
import { Edit, Eye } from "lucide-react";
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

  // Format voice part for display
  const formatVoicePart = (voicePart: string | null | undefined): string => {
    if (!voicePart) return "Not assigned";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor": return "Tenor";
      case "bass": return "Bass";
      default: return voicePart;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4">
        <CardTitle>{member.first_name || 'Unnamed'} {member.last_name || 'Member'}</CardTitle>
        <CardDescription>
          {member.role ? member.role.charAt(0).toUpperCase() + member.role.slice(1).replace('_', ' ') : 'Member'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-1">Email: {member.email || 'No email'}</p>
        <p>Voice Part: {formatVoicePart(member.voice_part)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Link to={`/dashboard/members/${member.id}`}>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
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
