
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { User } from "@/hooks/useUserManagement";
import { userFormSchema, UserFormValues } from "./form/userFormSchema";
import { EditAccountTabContent } from "./form/EditAccountTabContent";
import { EditProfileTabContent } from "./form/EditProfileTabContent";
import { toast } from "sonner";

interface EditUserFormProps {
  user: User;
  onSubmit: (data: UserFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export const EditUserForm: React.FC<EditUserFormProps> = ({ 
  user, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role || "singer",
      status: user.status || "active",
      voice_part: user.voice_part || null,
      phone: user.phone || null,
      password: "",
    },
  });

  const handleFormSubmit = async (data: UserFormValues) => {
    try {
      console.log("Form submitted with data:", data);
      await onSubmit(data);
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error("Failed to update user: " + (error.message || "Unknown error"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 mt-4">
            <EditAccountTabContent form={form} />
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <EditProfileTabContent form={form} />
          </TabsContent>
        </Tabs>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update User"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};
