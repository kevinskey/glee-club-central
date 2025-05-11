
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserManagement } from '@/hooks/useUserManagement';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

export function UserRoleEditor() {
  const { profile } = useAuth();
  const { updateUserRole } = useUserManagement();
  const [selectedRole, setSelectedRole] = useState<string>(profile?.role || '');
  const [isLoading, setIsLoading] = useState(false);

  // Update selected role when profile changes
  useEffect(() => {
    if (profile?.role) {
      setSelectedRole(profile.role);
    }
  }, [profile?.role]);

  const roles: { value: string; label: string }[] = [
    { value: "singer", label: "Singer" },
    { value: "section_leader", label: "Section Leader" },
    { value: "student_conductor", label: "Student Conductor" },
    { value: "accompanist", label: "Accompanist" },
    { value: "non_singer", label: "Non-Singer" }
  ];

  // Only show admin roles if user is already an admin
  if (profile?.role === 'administrator') {
    roles.unshift({ value: "administrator", label: "Administrator" });
  }
  
  if (profile?.role === 'director') {
    roles.unshift({ value: "director", label: "Director" });
  }

  const handleSave = async () => {
    if (!profile?.id || !selectedRole) {
      toast.error("Unable to update role");
      return;
    }

    setIsLoading(true);
    try {
      const success = await updateUserRole(profile.id, selectedRole);
      if (success) {
        toast.success("Your role has been updated");
        // Role updated successfully, page will be refreshed with updated permissions
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update role");
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if no profile is loaded
  if (!profile) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Glee Club Role</CardTitle>
        <CardDescription>
          Your current role determines your permissions and responsibilities in the Glee Club
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Select 
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-muted-foreground">
              {selectedRole === 'singer' && "Regular member of the Glee Club who participates in performances."}
              {selectedRole === 'section_leader' && "Leader responsible for a voice section in the Glee Club."}
              {selectedRole === 'student_conductor' && "Member who assists in conducting during rehearsals and performances."}
              {selectedRole === 'accompanist' && "Member who provides musical accompaniment for the Glee Club."}
              {selectedRole === 'non_singer' && "Member who supports the Glee Club in non-performance capacities."}
              {selectedRole === 'administrator' && "Full administrative access to the Glee World platform."}
              {selectedRole === 'director' && "Administrative access with artistic direction responsibilities."}
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isLoading || selectedRole === profile.role}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Updating..." : "Update Role"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
