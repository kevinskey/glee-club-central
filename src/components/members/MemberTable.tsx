
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowDown, 
  ArrowUp, 
  CheckCircle, 
  Edit, 
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Member } from "@/hooks/useMemberManagement";

interface MemberTableProps {
  filteredMembers: Member[];
  isLoading: boolean;
  handleEditMember: (memberId: string) => void;
  handleDeletePrompt: (memberId: string) => void;
  handleActivateUser: (userId: string) => void;
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending';
  } | null;
  setSortConfig: (config: {
    key: string;
    direction: 'ascending' | 'descending';
  } | null) => void;
  isAdmin: boolean;
}

export function MemberTable({ 
  filteredMembers, 
  isLoading, 
  handleEditMember, 
  handleDeletePrompt,
  handleActivateUser,
  sortConfig,
  setSortConfig,
  isAdmin
}: MemberTableProps) {
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort direction icon
  const getSortDirectionIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? 
      <ArrowUp className="ml-1 h-4 w-4" /> : 
      <ArrowDown className="ml-1 h-4 w-4" />;
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Render role badge
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'administrator':
        return <Badge className="bg-purple-500">Admin</Badge>;
      case 'section_leader':
        return <Badge className="bg-blue-500">Section Leader</Badge>;
      case 'student_conductor':
        return <Badge className="bg-indigo-500">Conductor</Badge>;
      case 'accompanist':
        return <Badge className="bg-pink-500">Accompanist</Badge>;
      case 'singer':
        return <Badge variant="outline">Singer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };
  
  // Format voice part display
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
  
  // Render dues paid indicator
  const renderDuesPaid = (duesPaid: boolean | null) => {
    if (duesPaid === null) return "Unknown";
    return duesPaid ? 
      <span className="text-green-500 font-medium">Paid</span> : 
      <span className="text-red-500 font-medium">Unpaid</span>;
  };
  
  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2 text-sm text-gray-500">Loading members...</p>
      </div>
    );
  }
  
  if (filteredMembers.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">No members found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => requestSort('last_name')}
            >
              <div className="flex items-center">
                Name
                {getSortDirectionIcon('last_name')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => requestSort('voice_part')}
            >
              <div className="flex items-center">
                Voice Part
                {getSortDirectionIcon('voice_part')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => requestSort('class_year')}
            >
              <div className="flex items-center">
                Class Year
                {getSortDirectionIcon('class_year')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => requestSort('role')}
            >
              <div className="flex items-center">
                Role
                {getSortDirectionIcon('role')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => requestSort('status')}
            >
              <div className="flex items-center">
                Status
                {getSortDirectionIcon('status')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:text-primary transition-colors"
              onClick={() => requestSort('dues_paid')}
            >
              <div className="flex items-center">
                Dues
                {getSortDirectionIcon('dues_paid')}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                {member.first_name || ''} {member.last_name || ''}
              </TableCell>
              <TableCell>{formatVoicePart(member.voice_part)}</TableCell>
              <TableCell>{member.class_year || 'N/A'}</TableCell>
              <TableCell>{renderRoleBadge(member.role)}</TableCell>
              <TableCell>{renderStatusBadge(member.status)}</TableCell>
              <TableCell>{renderDuesPaid(member.dues_paid)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {member.status === 'pending' && (
                    <Button 
                      size="sm" 
                      className="h-8 bg-green-600 hover:bg-green-700"
                      onClick={() => handleActivateUser(member.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Activate
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8"
                    onClick={() => handleEditMember(member.id)}
                  >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    className="h-8"
                    onClick={() => handleDeletePrompt(member.id)}
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
