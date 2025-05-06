
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define types for the profile data
type VoicePart = "soprano" | "alto" | "tenor" | "bass" | "baritone" | "";
type UserRole = 
  | "member" 
  | "librarian" 
  | "director" 
  | "admin" 
  | "student_director" 
  | "s1_section_leader" 
  | "s2_section_leader" 
  | "a1_section_leader" 
  | "a2_section_leader" 
  | "accompanist";

// Update Profile interface to match the database structure
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  voice_part: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
  avatar_url?: string; 
  biography?: string;
  username?: string;
  email?: string;
}

// Form schemas
const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  full_name: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  biography: z.string().optional(),
  voice_part: z.string().optional(),
});

const PasswordChangeSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password must be at least 6 characters.",
  }),
  newPassword: z.string().min(6, {
    message: "New password must be at least 6 characters.",
  }),
  confirmPassword: z.string().min(6, {
    message: "Confirm password must be at least 6 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Initialize the profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      full_name: "",
      biography: "",
      voice_part: "",
    },
  });

  // Initialize the password form
  const passwordForm = useForm<z.infer<typeof PasswordChangeSchema>>({
    resolver: zodResolver(PasswordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user profile on component mount
  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        username: profile.username || "",
        full_name: profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : "",
        biography: profile.biography || "",
        voice_part: profile.voice_part || "",
      });
      
      // Set avatar URL if available
      if (profile.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      }
    }
  }, [profile]);

  const getProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("No user");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // The data from Supabase is already compatible with our Profile interface
        setProfile(data as Profile);
      }
    } catch (error: any) {
      console.error("Error loading user data:", error.message);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar upload
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!user) throw new Error("No user");
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const avatarUrl = data.publicUrl;

      try {
        // First attempt: Try using the RPC function
        const { error: rpcError } = await supabase.rpc(
          'update_profile_avatar',
          {
            user_id: user.id,
            avatar_url_value: avatarUrl
          }
        );
        
        if (rpcError) {
          throw rpcError;
        }
      } catch (rpcFailure) {
        // Second attempt: If RPC fails, try direct update with type assertion
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          } as any)
          .eq('id', user.id);
          
        if (updateError) {
          throw updateError;
        }
      }

      setAvatarUrl(avatarUrl);
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });

      // Refresh profile data
      getProfile();
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast({
        title: "Error uploading avatar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle profile form submission
  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("No user");

      // Split full name into first and last name
      const nameParts = values.full_name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create an updateData object that matches the profile schema
      const updateData: {
        first_name: string,
        last_name: string,
        voice_part: string | null,
        updated_at: string,
        // Add optional fields that might not be in the DB schema
        username?: string,
        biography?: string,
      } = {
        first_name: firstName,
        last_name: lastName,
        voice_part: values.voice_part === "none" ? null : values.voice_part as VoicePart || null,
        updated_at: new Date().toISOString(),
      };

      // Conditionally add the metadata fields
      if (values.username) {
        updateData.username = values.username;
      }
      
      if (values.biography) {
        updateData.biography = values.biography;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Refresh profile data
      getProfile();
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password form submission
  const onPasswordSubmit = async (values: z.infer<typeof PasswordChangeSchema>) => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("No user");

      // Update password logic 
      // Note: Supabase doesn't have a direct method to update password with old password verification
      // In a real app, you'd need to verify the current password server-side first
      
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      // Reset the form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Error updating password:", error.message);
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has director/admin privileges
  const hasAdminPrivileges = () => {
    return profile?.role === "director" || profile?.role === "admin";
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">My Profile</h1>
        
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Avatar with upload option */}
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage 
                    src={avatarUrl || "/placeholder.svg"} 
                    alt="Profile picture" 
                  />
                  <AvatarFallback>
                    {profile?.first_name?.charAt(0) || profile?.username?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground p-1 rounded-full">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </div>
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={uploadAvatar}
                    disabled={uploading} 
                  />
                </div>
              </div>
              
              {/* User info */}
              <div>
                <h3 className="font-bold text-xl">
                  {profile?.first_name && profile?.last_name
                    ? `${profile.first_name} ${profile.last_name}`
                    : profile?.username || "User"}
                </h3>
                <p className="text-muted-foreground">{profile?.voice_part || "No voice part set"}</p>
                <p className="text-muted-foreground">
                  {profile?.role 
                    ? formatRole(profile.role)
                    : "Member"}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Profile Edit Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Edit Profile Information</h3>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="voice_part"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice Part</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voice part" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No voice part</SelectItem>
                              <SelectItem value="soprano">Soprano</SelectItem>
                              <SelectItem value="alto">Alto</SelectItem>
                              <SelectItem value="tenor">Tenor</SelectItem>
                              <SelectItem value="baritone">Baritone</SelectItem>
                              <SelectItem value="bass">Bass</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="biography"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>About Me</FormLabel>
                          <FormControl>
                            <Input placeholder="A short bio..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium">Change Password</h3>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter current password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Enter new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Confirm new password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Helper function to format role names for display
function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    'member': 'Member',
    'librarian': 'Librarian',
    'director': 'Director',
    'admin': 'Administrator',
    'student_director': 'Student Director',
    's1_section_leader': 'S1 Section Leader',
    's2_section_leader': 'S2 Section Leader',
    'a1_section_leader': 'A1 Section Leader',
    'a2_section_leader': 'A2 Section Leader',
    'accompanist': 'Accompanist'
  };
  
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
}
