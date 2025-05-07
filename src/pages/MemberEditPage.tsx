
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, User } from "lucide-react";
import { fetchUserById } from "@/utils/supabaseQueries";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateUser } from "@/utils/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().nullable().optional(),
  role: z.string(),
  status: z.string(),
  voice_part: z.string().nullable().optional(),
  class_year: z.string().nullable().optional(),
  join_date: z.string().nullable().optional(),
  dues_paid: z.boolean().default(false),
  notes: z.string().nullable().optional(),
  special_roles: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MemberEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  
  // Check if user can edit this profile
  const isOwnProfile = user?.id === id;
  const canEditAllFields = isAdmin();
  
  if (!isAdmin() && !isOwnProfile) {
    navigate('/dashboard');
    toast.error("You don't have permission to edit this profile");
    return null;
  }
  
  // Fetch member data
  const { data: member, isLoading } = useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => fetchUserById(id as string),
    enabled: !!id,
  });
  
  // Setup form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: member?.email || "",
      first_name: member?.first_name || "",
      last_name: member?.last_name || "",
      phone: member?.phone || "",
      role: member?.role || "singer",
      status: member?.status || "active",
      voice_part: member?.voice_part || null,
      class_year: member?.class_year || "",
      join_date: member?.join_date || "",
      dues_paid: member?.dues_paid || false,
      notes: member?.notes || "",
      special_roles: member?.special_roles || "",
    },
    values: {
      email: member?.email || "",
      first_name: member?.first_name || "",
      last_name: member?.last_name || "",
      phone: member?.phone || "",
      role: member?.role || "singer",
      status: member?.status || "active",
      voice_part: member?.voice_part || null,
      class_year: member?.class_year || "",
      join_date: member?.join_date || "",
      dues_paid: member?.dues_paid || false,
      notes: member?.notes || "",
      special_roles: member?.special_roles || "",
    }
  });
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    try {
      const updateData = {
        id,
        ...data,
      };
      
      // Filter out fields that non-admin users can't change
      if (!canEditAllFields) {
        delete (updateData as any).role;
        delete (updateData as any).status;
      }
      
      const result = await updateUser(updateData);
      
      if (result.success) {
        toast.success("Profile updated successfully");
        navigate(`/dashboard/members/${id}`);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "An error occurred while updating the profile");
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
        <p className="ml-2">Loading profile...</p>
      </div>
    );
  }
  
  if (!member) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Profile not found</h2>
        <p className="mb-4">The requested profile could not be found.</p>
        <Button onClick={() => navigate('/dashboard/members')}>Return to Members</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <PageHeader
        title={`Edit Profile: ${member.first_name} ${member.last_name}`}
        description="Update member information and settings"
        icon={<User className="h-6 w-6" />}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:w-fit">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="membership">Membership</TabsTrigger>
                  <TabsTrigger value="notes">Notes & Roles</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Email address" 
                              {...field} 
                            />
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
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Phone number" 
                              {...field} 
                              value={field.value || ''} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="membership" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="voice_part"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voice Part</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value || ''} 
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select voice part" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="">Not specified</SelectItem>
                              <SelectItem value="soprano_1">Soprano 1</SelectItem>
                              <SelectItem value="soprano_2">Soprano 2</SelectItem>
                              <SelectItem value="alto_1">Alto 1</SelectItem>
                              <SelectItem value="alto_2">Alto 2</SelectItem>
                              <SelectItem value="tenor">Tenor</SelectItem>
                              <SelectItem value="bass">Bass</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="class_year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Year</FormLabel>
                          <FormControl>
                            <Input placeholder="Class year" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {canEditAllFields && (
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="administrator">Administrator</SelectItem>
                                <SelectItem value="section_leader">Section Leader</SelectItem>
                                <SelectItem value="student_conductor">Student Conductor</SelectItem>
                                <SelectItem value="singer">Singer</SelectItem>
                                <SelectItem value="accompanist">Accompanist</SelectItem>
                                <SelectItem value="non_singer">Non-Singer</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {canEditAllFields && (
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="alumni">Alumni</SelectItem>
                                <SelectItem value="on_leave">On Leave</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="join_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Join Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                              value={field.value || ''} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dues_paid"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Dues Paid
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="space-y-6">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Add notes about this member" 
                            className="min-h-[120px]" 
                            {...field}
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {canEditAllFields && (
                    <FormField
                      control={form.control}
                      name="special_roles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Roles</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any special roles or responsibilities" 
                              className="min-h-[100px]" 
                              {...field}
                              value={field.value || ''} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
