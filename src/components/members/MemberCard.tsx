
import React from "react";
import { User } from "@/hooks/useUserManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Mail, Phone } from "lucide-react";

interface MemberCardProps {
  member: User;
  displayMode: "grid" | "list";
  isAdmin: boolean;
  onActivate: (userId: string) => Promise<void>;
  onClick: () => void;
}

export function MemberCard({ member, displayMode, isAdmin, onActivate, onClick }: MemberCardProps) {
  const formatVoicePart = (voicePart: string | null | undefined): string => {
    if (!voicePart) return "Not specified";
    
    const voicePartMap: Record<string, string> = {
      "soprano_1": "Soprano 1",
      "soprano_2": "Soprano 2",
      "alto_1": "Alto 1",
      "alto_2": "Alto 2",
      "tenor": "Tenor",
      "bass": "Bass"
    };
    
    return voicePartMap[voicePart] || voicePart;
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "outline" | "secondary" | "destructive", label: string }> = {
      "active": { variant: "default", label: "Active" },
      "inactive": { variant: "secondary", label: "Inactive" },
      "pending": { variant: "outline", label: "Pending" },
      "on_leave": { variant: "secondary", label: "On Leave" },
      "alumni": { variant: "secondary", label: "Alumni" },
    };
    
    const { variant, label } = statusMap[status] || { variant: "outline", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  if (displayMode === "list") {
    return (
      <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onClick}>
        <CardContent className="p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-4">
              {member.avatar_url ? (
                <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
              ) : (
                <AvatarFallback>
                  {member.first_name?.[0]}{member.last_name?.[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-medium">{member.first_name} {member.last_name}</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{formatVoicePart(member.voice_part)}</span>
                {member.class_year && (
                  <>
                    <span>•</span>
                    <span>Class of {member.class_year}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusBadge(member.status)}
            
            {member.status === 'pending' && isAdmin && (
              <Button 
                size="sm" 
                className="h-8 bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onActivate(member.id);
                }}
              >
                <Check className="h-3 w-3 mr-1" />
                Activate
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="hover:bg-accent/50 cursor-pointer transition-colors" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center mb-3">
          <Avatar className="h-20 w-20 mb-3">
            {member.avatar_url ? (
              <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
            ) : (
              <AvatarFallback className="text-lg">
                {member.first_name?.[0]}{member.last_name?.[0]}
              </AvatarFallback>
            )}
          </Avatar>
          <h3 className="font-medium">{member.first_name} {member.last_name}</h3>
        </div>
        
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {getStatusBadge(member.status)}
          <Badge variant="outline">{formatVoicePart(member.voice_part)}</Badge>
          {member.class_year && (
            <Badge variant="secondary">Class of {member.class_year}</Badge>
          )}
        </div>
        
        <div className="space-y-2">
          {member.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{member.email}</span>
            </div>
          )}
          
          {member.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">{member.phone}</span>
            </div>
          )}
        </div>
        
        {member.status === 'pending' && isAdmin && (
          <Button 
            size="sm" 
            className="w-full mt-3 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              onActivate(member.id);
            }}
          >
            <Check className="h-3 w-3 mr-1" />
            Activate
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
