
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Music, Edit, Save } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Define form with react-hook-form
  const form = useForm({
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      voice_part: profile?.voice_part || "not_specified",
    },
  });

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        voice_part: profile.voice_part || "not_specified",
      });
    }
  }, [profile, form]);

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    } else if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Get voice part
  const getVoicePart = () => {
    if (profile?.voice_part) {
      // Map "not_specified" to a user-friendly display value
      if (profile.voice_part === "not_specified") {
        return "Not specified";
      }
      return profile.voice_part;
    }
    return "Not specified";
  };

  const onSubmit = async (data) => {
    try {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          voice_part: data.voice_part,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      
      // Force reload to update profile data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      // Reset form with current values when entering edit mode
      form.reset({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        voice_part: profile?.voice_part || "not_specified",
      });
      setIsEditing(true);
    }
  };

  // Voice part options based on the schema - using 'not_specified' as a valid non-empty string value
  const voicePartOptions = [
    { value: "not_specified", label: "Not specified" },
    { value: "Soprano1", label: "Soprano 1" },
    { value: "Soprano2", label: "Soprano 2" },
    { value: "Alto1", label: "Alto 1" },
    { value: "Alto2", label: "Alto 2" },
    { value: "Tenor", label: "Tenor" },
    { value: "Bass", label: "Bass" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="mx-auto max-w-3xl">
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 bg-glee-purple text-white text-2xl">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">{getDisplayName()}</CardTitle>
              <CardDescription>
                {profile?.role === "admin" ? "Administrator" : "Choir Member"}
              </CardDescription>
            </CardHeader>
            
            {isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
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
                                {voicePartOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground mt-1">{user?.email || "Not provided"}</p>
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleEditToggle}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-glee-purple hover:bg-glee-purple/90">
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            ) : (
              <>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-sm text-muted-foreground">
                          {profile?.first_name && profile?.last_name
                            ? `${profile.first_name} ${profile.last_name}`
                            : "Not provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user?.email || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-md">
                      <Music className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Voice Part</p>
                        <p className="text-sm text-muted-foreground">{getVoicePart()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Back to Dashboard
                  </Button>
                  <Button onClick={handleEditToggle} className="bg-glee-purple hover:bg-glee-purple/90">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
