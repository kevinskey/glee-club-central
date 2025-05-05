
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/ui/page-header";
import { UserCircle, Upload, Shield, AlertCircle } from "lucide-react";

// Define the form schema with Zod
const formSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters."),
  last_name: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  address: z.string().optional(),
  school: z.string().optional(),
  bio: z.string().optional(),
  voice_part: z.enum(["soprano", "alto", "tenor", "bass", "baritone", "not_specified"]).optional(),
  role: z.enum(["member", "director", "admin"]).optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Get initials for avatar fallback
  const getInitials = () => {
    if (profile) {
      return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`;
    }
    return "GC"; // Glee Club default
  };

  useEffect(() => {
    // Set avatar URL if profile exists and has avatar_url
    if (profile && profile.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  // Setup form with default values from profile
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: "",
      phone: "",
      address: "",
      school: "",
      bio: "",
      voice_part: profile?.voice_part as any || "not_specified",
      role: profile?.role as any || "member",
    },
  });

  // Update form values when profile data is available
  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: "",
        phone: "",
        address: "",
        school: "",
        bio: "",
        voice_part: profile.voice_part as any || "not_specified",
        role: profile.role as any || "member",
      });
    }
  }, [profile, form]);

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update profile in database
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          voice_part: data.voice_part,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      if (!user) {
        throw new Error("You must be logged in to upload an avatar.");
      }

      setIsUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarUrl(avatarUrl);

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Voice part display options
  const getVoicePartDisplay = (voicePart: string | undefined) => {
    switch (voicePart) {
      case "soprano":
        return "Soprano";
      case "alto":
        return "Alto";
      case "tenor":
        return "Tenor";
      case "bass":
        return "Bass";
      case "baritone":
        return "Baritone";
      default:
        return "Not Specified";
    }
  };

  // Role display and badge
  const getRoleBadge = (role: string | undefined) => {
    if (role === "director") {
      return (
        <Badge variant="outline" className="ml-2 bg-glee-purple/10 text-glee-purple border-glee-purple">
          <Shield className="w-3 h-3 mr-1" /> Director
        </Badge>
      );
    } else if (role === "admin") {
      return (
        <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-600 border-amber-200">
          <Shield className="w-3 h-3 mr-1" /> Admin
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="ml-2">
        Member
      </Badge>
    );
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold">Authentication Required</h2>
          <p className="mt-2 text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your personal information"
        icon={<UserCircle className="h-6 w-6" />}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile image</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={avatarUrl || ""} alt={profile?.first_name} />
                <AvatarFallback className="text-xl bg-glee-purple text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <label htmlFor="avatar-upload">
                <Button 
                  variant="outline" 
                  className="cursor-pointer gap-2"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Picture"}
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your membership information</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium leading-none">Voice Part</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getVoicePartDisplay(profile?.voice_part)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium leading-none">Role</h3>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    {profile?.role === "director" ? "Director" : 
                     profile?.role === "admin" ? "Administrator" : "Member"}
                    {getRoleBadge(profile?.role)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium leading-none">Member Since</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs defaultValue="personal">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="choir">Choir Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
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
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading} className="ml-auto">
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            
            <TabsContent value="choir">
              <Card>
                <CardHeader>
                  <CardTitle>Choir Settings</CardTitle>
                  <CardDescription>
                    Update your choir-specific information
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
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
                                  <SelectValue placeholder="Select your voice part" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="soprano">Soprano</SelectItem>
                                <SelectItem value="alto">Alto</SelectItem>
                                <SelectItem value="tenor">Tenor</SelectItem>
                                <SelectItem value="baritone">Baritone</SelectItem>
                                <SelectItem value="bass">Bass</SelectItem>
                                <SelectItem value="not_specified">Not Specified</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Your primary singing voice classification
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading} className="ml-auto">
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
