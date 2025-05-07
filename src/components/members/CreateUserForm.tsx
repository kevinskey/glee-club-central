
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import { userFormSchema, UserFormValues } from "./form/userFormSchema";
import { AccountTabContent } from "./form/AccountTabContent";
import { ProfileTabContent } from "./ProfileTabContent";

interface CreateUserFormProps {
  onSubmit: (data: UserFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ 
  onSubmit, 
  isSubmitting = false 
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      role: "member",
      status: "active",
      voice_part: null,
      phone: null,
      password: "",
      section_id: null,
    },
  });

  const handleSubmit = async (data: UserFormValues) => {
    console.log("Form submitted with data:", data);
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4 mt-4">
            <AccountTabContent form={form} />
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <ProfileTabContent form={form} />
          </TabsContent>
        </Tabs>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" type="button">Cancel</Button>
          </SheetClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
};
