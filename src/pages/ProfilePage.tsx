
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { User, PencilLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, profile, refreshPermissions } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    voicePart: "",
    email: user?.email || "",
    role: profile?.role || ""
  });

  // Available voice parts for dropdown
  const voiceParts = [
    { value: "soprano_1", label: "Soprano 1" },
    { value: "soprano_2", label: "Soprano 2" },
    { value: "alto_1", label: "Alto 1" },
    { value: "alto_2", label: "Alto 2" },
    { value: "tenor", label: "Tenor" },
    { value: "bass", label: "Bass" }
  ];

  // Initialize form data from profile if available
  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        voicePart: profile.voice_part || "",
        email: user?.email || "",
        role: profile.role || ""
      });
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile.");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          voice_part: formData.voicePart,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) {
        console.error("Profile update error:", error);
        toast.error("Failed to update profile: " + error.message);
        return;
      }

      // Refresh user profile data after successful update
      if (refreshPermissions) {
        await refreshPermissions();
      }
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile: " + (error.message || "Unknown error"));
    }
  };

  // Format voice part for display
  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "Not set";
    
    const voicePartMap: {[key: string]: string} = {
      "soprano_1": "Soprano 1",
      "soprano_2": "Soprano 2",
      "alto_1": "Alto 1",
      "alto_2": "Alto 2",
      "tenor": "Tenor",
      "bass": "Bass"
    };
    
    return voicePartMap[voicePart] || voicePart;
  };

  // Format role for display
  const formatRole = (role: string | null | undefined) => {
    if (!role) return "Not set";
    
    const roleMap: {[key: string]: string} = {
      "administrator": "Administrator",
      "section_leader": "Section Leader",
      "singer": "Singer",
      "student_conductor": "Student Conductor",
      "accompanist": "Accompanist",
      "non_singer": "Non-Singer"
    };
    
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and edit your profile information"
        icon={<User className="h-6 w-6" />}
        actions={
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <PencilLine className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your basic profile information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.first_name || "Not set"} {profile?.last_name || ""}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">{user?.email || "Not set"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Voice Part</h4>
                <p className="text-sm text-muted-foreground">{formatVoicePart(profile?.voice_part)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Member Since</h4>
                <p className="text-sm text-muted-foreground">
                  {profile?.join_date ? new Date(profile.join_date).toLocaleDateString() : "Not set"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Choir Membership</CardTitle>
            <CardDescription>
              Your membership status and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <p className="text-sm text-muted-foreground">{profile?.status || "Not set"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Dues</h4>
                <p className="text-sm text-muted-foreground">{profile?.dues_paid ? "Paid" : "Unpaid"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Role</h4>
                <p className="text-sm text-muted-foreground">{formatRole(profile?.role)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Class Year</h4>
                <p className="text-sm text-muted-foreground">{profile?.class_year || "Not set"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="voicePart" className="text-right">
                  Voice Part
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.voicePart}
                    onValueChange={(value) => handleSelectChange("voicePart", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice part" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {voiceParts.map((part) => (
                          <SelectItem key={part.value} value={part.value}>
                            {part.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
