import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, Download, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile, VoicePart, MemberStatus } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MemberDetailsSheet } from "@/components/members/MemberDetailsSheet";
import { fetchSections, fetchMembers, Section } from "@/utils/supabaseQueries";

interface Section {
  id: string;
  name: string;
}

export default function MemberDirectoryPage() {
  const { isAdmin, isSectionLeader } = useAuth();
  const [members, setMembers] = useState<Profile[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Profile[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [voiceFilter, setVoiceFilter] = useState<string>("all");
  const [sectionFilter, setSectionFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Fetch all sections using our utility function
        const sectionsData = await fetchSections();
        setSections(sectionsData);
        
        // Fetch members using our utility function
        const membersData = await fetchMembers();
        setMembers(membersData);
        setFilteredMembers(membersData);
      } catch (error: any) {
        console.error("Error fetching members:", error);
        toast.error(error.message || "Failed to load member data");
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, [isAdmin, isSectionLeader]);
  
  useEffect(() => {
    // Filter members based on search term and filters
    let filtered = [...members];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        (member.first_name?.toLowerCase().includes(term) || 
         member.last_name?.toLowerCase().includes(term) || 
         member.email?.toLowerCase().includes(term))
      );
    }
    
    // Voice part filter
    if (voiceFilter !== "all") {
      filtered = filtered.filter(member => member.voice_part === voiceFilter);
    }
    
    // Section filter
    if (sectionFilter !== "all") {
      filtered = filtered.filter(member => member.section_id === sectionFilter);
    }
    
    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    setFilteredMembers(filtered);
  }, [searchTerm, voiceFilter, sectionFilter, statusFilter, members]);

  // Export member data to CSV
  const exportToCsv = () => {
    // Create CSV header
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Voice Part',
      'Status',
      'Join Date',
    ];
    
    // Format member data for CSV
    const csvData = filteredMembers.map(member => [
      member.first_name || '',
      member.last_name || '',
      member.email || '',
      member.phone || '',
      member.voice_part || '',
      member.status,
      member.join_date || '',
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create downloadable link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `choir-members-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get status badge variant
  const getStatusBadge = (status: MemberStatus) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      case "alumni":
        return <Badge className="bg-blue-500">Alumni</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Member Directory"
        description="View and manage choir members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
            <div className="flex flex-1 items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              {isAdmin() && (
                <Button asChild>
                  <Link to="/invite-member">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite Member
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={exportToCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <Select
                value={voiceFilter}
                onValueChange={setVoiceFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Voice Part" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Voice Parts</SelectItem>
                  <SelectItem value="soprano">Soprano</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="tenor">Tenor</SelectItem>
                  <SelectItem value="bass">Bass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={sectionFilter}
                onValueChange={setSectionFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>
                      {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Voice Part</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                        <p>Loading members...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No members found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            {member.avatar_url ? (
                              <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
                            ) : (
                              <AvatarFallback>
                                {member.first_name?.[0]}{member.last_name?.[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{`${member.first_name || ''} ${member.last_name || ''}`}</p>
                            {member.role === "admin" && <span className="text-xs text-muted-foreground">Administrator</span>}
                            {member.role === "section_leader" && <span className="text-xs text-muted-foreground">Section Leader</span>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.voice_part || "Not set"}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.email || "N/A"}</TableCell>
                      <TableCell className="hidden md:table-cell">{member.phone || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                            >
                              Details
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="sm:max-w-md">
                            {selectedMember && (
                              <MemberDetailsSheet member={selectedMember} />
                            )}
                          </SheetContent>
                        </Sheet>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredMembers.length} of {members.length} members
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
