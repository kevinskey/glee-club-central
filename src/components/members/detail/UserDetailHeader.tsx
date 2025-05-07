
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { User } from "@/hooks/useUserManagement";
import { getRoleBadge, getStatusBadge } from "@/components/members/UserBadges";

interface UserDetailHeaderProps {
  user: User;
}

export const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({ user }) => {
  const formatVoicePart = (voicePart?: string | null) => {
    // Use voice_part_display if available
    return user.voice_part_display || (voicePart || "Not set");
  };
  
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-10 w-10">
        {user.avatar_url ? (
          <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
        ) : (
          <AvatarFallback>
            {user.first_name?.[0]}{user.last_name?.[0]}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <SheetTitle>{user.first_name} {user.last_name}</SheetTitle>
        <SheetDescription className="flex flex-wrap gap-2 items-center">
          {getRoleBadge(user.role)}
          {getStatusBadge(user.status)}
          <span className="text-xs">Voice: {formatVoicePart(user.voice_part)}</span>
        </SheetDescription>
      </div>
    </div>
  );
};
