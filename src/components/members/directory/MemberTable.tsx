
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { User } from "@/hooks/useUserManagement";
import { getStatusBadge, getRoleBadge } from "@/components/members/UserBadges";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MemberTableProps {
  filteredUsers: User[];
  isLoading: boolean;
  handleActivateUser: (userId: string) => Promise<void>;
}

export function MemberTable({ filteredUsers, isLoading, handleActivateUser }: MemberTableProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
          <p>Loading members...</p>
        </div>
      </div>
    );
  }
  
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No members found matching your criteria</p>
      </div>
    );
  }

  // Get role display name
  const getRoleDisplay = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return "Administrator";
      case 'section_leader':
        return "Section Leader";
      case 'student_conductor':
        return "Student Conductor";
      case 'accompanist':
        return "Accompanist";
      case 'singer':
        return "Singer";
      case 'member':
        return "Member";
      default:
        return role;
    }
  };
  
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Role</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-4">
                {user.first_name || ''} {user.last_name || ''}
              </td>
              <td className="py-3 px-4">{user.email || 'No email'}</td>
              <td className="py-3 px-4">{getRoleBadge(user.role)}</td>
              <td className="py-3 px-4">{getStatusBadge(user.status)}</td>
              <td className="py-3 px-4 text-right">
                <div className="flex justify-end gap-2">
                  {user.status === 'pending' && isAdmin() && (
                    <Button 
                      size="sm" 
                      className="h-8 bg-green-600 hover:bg-green-700"
                      onClick={() => handleActivateUser(user.id)}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => navigate(`/dashboard/members/${user.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
