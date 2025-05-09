
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserManagement } from "@/hooks/useUserManagement";
import { MembersList } from "@/components/members/MembersList";
import { useMedia } from "@/hooks/use-mobile";

export default function MembersPage() {
  const { isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [voicePartFilter, setVoicePartFilter] = useState("");
  const isMobile = useMedia('(max-width: 640px)');
  
  const {
    users: members,
    isLoading,
    fetchUsers,
  } = useUserManagement();
  
  // Fetch members on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Glee Club Members"
        description="View all Spelman College Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
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
    </div>
  );
}
