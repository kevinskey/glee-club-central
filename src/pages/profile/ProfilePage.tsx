
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@supabase/supabase-js";
import { UserCircle2, ShieldCheck, Settings } from "lucide-react";

// Updated profile schema with optional fields and voice part
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  voice_part: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  school: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  voice_part: string;
  email?: string;
  phone?: string;
  address?: string;
  school?: string;
  bio?: string;
  full_name?: string;
  avatar_url?: string;
  role: string;
}

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create a form with default values
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      voice_part: "",
      email: "",
      phone: "",
      address: "",
      school: "",
      bio: "",
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (authProfile) {
      // Set form values when profile data is available
      form.reset({
        first_name: authProfile.first_name || "",
        last_name: authProfile.last_name || "",
        voice_part: authProfile.voice_part || "",
        email: authProfile.email || "",
        phone: authProfile.phone || "",
        address: authProfile.address || "",
        school: authProfile.school || "",
        bio: authProfile.bio || "",
      });
    }
  }, [authProfile, form]);

  // Function to handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("No user found");
      }

      // Update user profile in the database
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          voice_part: values.voice_part,
          email: values.email,
          phone: values.phone,
          address: values.address,
          school: values.school,
          bio: values.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Upload avatar if selected
      if (avatar) {
        await uploadAvatar(user);
      }

      // Refresh profile data
      await refreshProfile();

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle avatar upload
  const uploadAvatar = async (user: User) => {
    try {
      setUploading(true);

      if (!avatar) return;

      // Upload the avatar image
      const fileExt = avatar.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatar);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: urlData.publicUrl,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatar(null);
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error uploading avatar",
        description: error.message || "An error occurred while uploading your avatar.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and account settings"
        icon={<UserCircle2 className="h-6 w-6" />}
      />

      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserCircle2 className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Permissions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={authProfile?.avatar_url || ""} />
                        <AvatarFallback>
                          {authProfile?.first_name?.[0]}{authProfile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                        />
                        {avatar && (
                          <p className="mt-2 text-sm">{avatar.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="voice_part"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice Part</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voice part" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="soprano">Soprano</SelectItem>
                              <SelectItem value="alto">Alto</SelectItem>
                              <SelectItem value="tenor">Tenor</SelectItem>
                              <SelectItem value="bass">Bass</SelectItem>
                              <SelectItem value="not_specified">Not specified</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading || uploading}>
                      {loading || uploading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Provide additional details for better choir management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School/University</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Tell us a bit about yourself, your musical experience, etc."
                              className="min-h-[100px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading || uploading}>
                      {loading || uploading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>
                Your account role and permissions in the choir application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Current Role</h3>
                    <p className="text-sm text-muted-foreground">
                      {authProfile?.role === "admin" ? "Administrator" : 
                       authProfile?.role === "director" ? "Choir Director" : "Choir Member"}
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Your Permissions</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Access to sheet music</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Access to audio recordings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span>Ability to create setlists</span>
                    </li>
                    {(authProfile?.role === "admin" || authProfile?.role === "director") && (
                      <>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>Upload and manage sheet music</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span>Upload and manage audio recordings</span>
                        </li>
                      </>
                    )}
                    {authProfile?.role === "admin" && (
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Manage user accounts and permissions</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>
                Manage your application preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  App settings will be available in a future update. Stay tuned!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
