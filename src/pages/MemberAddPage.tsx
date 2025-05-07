
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { ArrowLeft, UserPlus } from "lucide-react";
import { CreateUserData } from "@/utils/admin/types";
import { createUser } from "@/utils/admin/userCreate";
import { AccountTabContent } from "@/components/members/form/AccountTabContent";
import { ProfileFormFields } from "@/components/members/form/ProfileFormFields";

const userFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  role: z.string(),
  status: z.string(),
  voice_part: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  class_year: z.string().nullable().optional(),
  join_date: z.string().nullable().optional(),
  dues_paid: z.boolean().optional(),
  notes: z.string().nullable().optional(),
  special_roles: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof userFormSchema>;

export default function MemberAddPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "singer",
      status: "active",
      voice_part: null,
      phone: null,
      class_year: null,
      join_date: null,
      dues_paid: false,
      notes: null,
      special_roles: null,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!isAdmin()) {
      toast.error("You don't have permission to add members");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const userData: CreateUserData = {
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part,
        phone: data.phone,
        class_year: data.class_year,
        join_date: data.join_date,
        dues_paid: data.dues_paid,
        notes: data.notes,
        special_roles: data.special_roles,
      };
      
      const result = await createUser(userData);
      
      if (result.success) {
        toast.success("Member added successfully");
        navigate("/dashboard/member-directory");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin()) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p className="mb-4">You don't have permission to add members.</p>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <PageHeader
        title="Add New Member"
        description="Create a new member account for the Glee Club"
        icon={<UserPlus className="h-6 w-6" />}
      />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Member Information</CardTitle>
          <CardDescription>
            Enter the new member's details. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid grid-cols-2 w-full sm:w-[400px]">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                </TabsList>
                
                <TabsContent value="account" className="space-y-4 mt-4">
                  <AccountTabContent form={form} />
                </TabsContent>
                
                <TabsContent value="profile" className="space-y-4 mt-4">
                  <ProfileFormFields form={form} />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Add Member"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
