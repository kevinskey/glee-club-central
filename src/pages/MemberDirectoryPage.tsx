import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Search, Download, UserPlus, Upload, Printer, UserCog, UserX, ListOrdered, Edit, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddMemberDialog } from "@/components/members/AddMemberDialog";
import { EditMemberDialog } from "@/components/members/EditMemberDialog";

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
  const [sortField, setSortField] = useState<"name" | "voice_part" | "section">("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Profile | null>(null);

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
    
    // Apply sorting
    filtered = sortMembers(filtered);
    
    setFilteredMembers(filtered);
  }, [searchTerm, voiceFilter, sectionFilter, statusFilter, members, sortField, sortDirection]);

  // Sort members based on selected field and direction
  const sortMembers = (membersList: Profile[]) => {
    return [...membersList].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === "name") {
        const nameA = `${a.last_name || ''}, ${a.first_name || ''}`.toLowerCase();
        const nameB = `${b.last_name || ''}, ${b.first_name || ''}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      } else if (sortField === "voice_part") {
        const voiceA = a.voice_part?.toLowerCase() || '';
        const voiceB = b.voice_part?.toLowerCase() || '';
        comparison = voiceA.localeCompare(voiceB);
      } else if (sortField === "section") {
        // Get section names for comparison
        const sectionA = sections.find(s => s.id === a.section_id)?.name?.toLowerCase() || '';
        const sectionB = sections.find(s => s.id === b.section_id)?.name?.toLowerCase() || '';
        comparison = sectionA.localeCompare(sectionB);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  };

  // Toggle sort direction or change sort field
  const handleSort = (field: "name" | "voice_part" | "section") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  // Import CSV
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvText = event.target?.result as string;
        const rows = csvText.split('\n');
        const headers = rows[0].split(',');
        
        // Validate headers
        const requiredHeaders = ['First Name', 'Last Name', 'Email'];
        const hasRequiredHeaders = requiredHeaders.every(h => headers.includes(h));
        
        if (!hasRequiredHeaders) {
          toast.error("CSV file is missing required columns: First Name, Last Name, Email");
          return;
        }
        
        toast.success(`CSV with ${rows.length - 1} members ready for import`);
        // In a real implementation, you would process the CSV data and add members to the database
        console.log("CSV import data:", { headers, rows: rows.slice(1) });
        
      } catch (error) {
        toast.error("Failed to parse CSV file");
        console.error("CSV import error:", error);
      }
    };
    
    reader.readAsText(file);
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  // Print member list
  const printMemberList = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Pop-up blocked. Please allow pop-ups for this site.");
      return;
    }
    
    // Create a simple formatted HTML for printing
    printWindow.document.write(`
      <html>
        <head>
          <title>Member List - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .print-date { text-align: right; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Spelman College Glee Club - Member Directory</h1>
          <p class="print-date">Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Voice Part</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredMembers.map(member => `
                <tr>
                  <td>${member.first_name || ''} ${member.last_name || ''}</td>
                  <td>${member.email || ''}</td>
                  <td>${member.phone || ''}</td>
                  <td>${member.voice_part || ''}</td>
                  <td>${member.status}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to be loaded before printing
    setTimeout(() => {
      printWindow.print();
      // printWindow.close(); // Uncomment to auto-close after print dialog
    }, 500);
  };

  // Delete member
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      // This would connect to your backend to actually delete the member
      // For now we'll just simulate it
      toast.success(`Member ${memberToDelete.first_name} ${memberToDelete.last_name} has been removed`);
      
      // Update local state
      const updatedMembers = members.filter(m => m.id !== memberToDelete.id);
      setMembers(updatedMembers);
      
      setIsDeleteConfirmOpen(false);
      setMemberToDelete(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete member");
    }
  };

  // Get status badge
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
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setIsAddMemberOpen(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
              
              <Button variant="outline" onClick={exportToCsv}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              
              <div className="relative">
                <Input
                  type="file"
                  accept=".csv"
                  id="csv-upload"
                  className="hidden"
                  onChange={handleImportCSV}
                />
                <Button variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              </div>
              
              <Button variant="outline" onClick={printMemberList}>
                <Printer className="mr-2 h-4 w-4" />
                Print
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
                  <SelectItem value="soprano_1">Soprano 1</SelectItem>
                  <SelectItem value="soprano_2">Soprano 2</SelectItem>
                  <SelectItem value="alto_1">Alto 1</SelectItem>
                  <SelectItem value="alto_2">Alto 2</SelectItem>
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
            
            <div>
              <Select 
                value={`${sortField}-${sortDirection}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split('-') as ["name" | "voice_part" | "section", "asc" | "desc"];
                  setSortField(field);
                  setSortDirection(direction);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="voice_part-asc">Voice Part (A-Z)</SelectItem>
                  <SelectItem value="voice_part-desc">Voice Part (Z-A)</SelectItem>
                  <SelectItem value="section-asc">Section (A-Z)</SelectItem>
                  <SelectItem value="section-desc">Section (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                    Member {sortField === "name" && (sortDirection === "asc" ? "↓" : "↑")}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("voice_part")}>
                    Voice Part {sortField === "voice_part" && (sortDirection === "asc" ? "↓" : "↑")}
                  </TableHead>
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
                        <div className="flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsEditMemberOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => {
                              setMemberToDelete(member);
                              setIsDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                        </div>
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
      
      {/* Add Member Dialog */}
      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        sections={sections}
        onAddMember={(newMember) => {
          setMembers(prev => [...prev, newMember]);
          toast.success(`${newMember.first_name} ${newMember.last_name} has been added`);
        }}
      />
      
      {/* Edit Member Dialog */}
      <EditMemberDialog
        open={isEditMemberOpen}
        onOpenChange={setIsEditMemberOpen}
        member={selectedMember}
        sections={sections}
        onUpdateMember={(updatedMember) => {
          setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
          toast.success(`${updatedMember.first_name} ${updatedMember.last_name}'s information has been updated`);
        }}
      />
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {memberToDelete && (
            <div className="flex items-center space-x-3 py-4">
              <Avatar>
                {memberToDelete.avatar_url ? (
                  <AvatarImage src={memberToDelete.avatar_url} alt={`${memberToDelete.first_name} ${memberToDelete.last_name}`} />
                ) : (
                  <AvatarFallback>
                    {memberToDelete.first_name?.[0]}{memberToDelete.last_name?.[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{`${memberToDelete.first_name || ''} ${memberToDelete.last_name || ''}`}</p>
                <p className="text-sm text-muted-foreground">{memberToDelete.email}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteMember}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
