
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Users, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Sample member data for demonstration
const sampleMembers = [
  {
    id: "1",
    firstName: "Alexis",
    lastName: "Johnson",
    email: "alexis.johnson@example.com",
    role: "singer",
    voicePart: "soprano_1",
    status: "active",
    duesPaid: true,
    joinDate: "2023-08-15",
  },
  {
    id: "2",
    firstName: "Jamal",
    lastName: "Williams",
    email: "jwilliams@example.com",
    role: "section_leader",
    voicePart: "tenor",
    status: "active",
    duesPaid: true,
    joinDate: "2022-09-01",
  },
  {
    id: "3",
    firstName: "Taylor",
    lastName: "Smith",
    email: "tsmith@example.com",
    role: "singer",
    voicePart: "alto_1",
    status: "active",
    duesPaid: false,
    joinDate: "2023-01-10",
  },
  {
    id: "4",
    firstName: "Maya",
    lastName: "Rodriguez",
    email: "mrodriguez@example.com",
    role: "student_conductor",
    voicePart: "soprano_2",
    status: "active",
    duesPaid: true,
    joinDate: "2022-08-20",
  },
  {
    id: "5",
    firstName: "Devon",
    lastName: "Carter",
    email: "dcarter@example.com",
    role: "accompanist",
    voicePart: null,
    status: "active",
    duesPaid: true,
    joinDate: "2021-11-05",
  },
];

// Format voice part for display
const formatVoicePart = (voicePart: string | null): string => {
  if (!voicePart) return "N/A";
  
  const parts: {[key: string]: string} = {
    soprano_1: "Soprano 1",
    soprano_2: "Soprano 2",
    alto_1: "Alto 1",
    alto_2: "Alto 2",
    tenor: "Tenor",
    bass: "Bass"
  };
  
  return parts[voicePart] || voicePart;
};

// Format role for display
const formatRole = (role: string): string => {
  const roles: {[key: string]: string} = {
    administrator: "Administrator",
    section_leader: "Section Leader",
    singer: "Singer",
    student_conductor: "Student Conductor",
    accompanist: "Accompanist",
    non_singer: "Non-Singer"
  };
  
  return roles[role] || role;
};

export default function AdminMembersPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState(sampleMembers);

  // Redirect if user is not authenticated or not an admin
  if (!isLoading && (!isAuthenticated || !isAdmin())) {
    return <Navigate to="/dashboard" />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter members based on search query
  const filteredMembers = members.filter(member => 
    member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Member Management"
        description="View and manage all Glee Club members"
        icon={<Users className="h-6 w-6" />}
      />
      
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Voice Part</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dues</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{member.firstName} {member.lastName}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatRole(member.role)}</TableCell>
                  <TableCell>{formatVoicePart(member.voicePart)}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.duesPaid ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Paid
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Unpaid
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(member.joinDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Change Voice Part</DropdownMenuItem>
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
