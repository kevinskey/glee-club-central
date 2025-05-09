
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, UserFormValues } from "./form/userFormSchema";
import { RoleStatusSelect } from "./form/RoleStatusSelect";
import { Loader2 } from "lucide-react";

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberAdd: (data: UserFormValues) => Promise<void>;
  isSubmitting: boolean;
  initialValues?: UserFormValues;
  isEditing?: boolean;
}

export function AddMemberDialog({
  isOpen,
  onOpenChange,
  onMemberAdd,
  isSubmitting,
  initialValues,
  isEditing = false
}: AddMemberDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues || {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      role: "singer",
      voice_part: "soprano_1",
      status: "pending"
    }
  });

  // Reset form when dialog opens/closes or when editing a different user
  React.useEffect(() => {
    if (isOpen) {
      if (initialValues) {
        form.reset(initialValues);
      } else {
        form.reset({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          phone: "",
          role: "singer",
          voice_part: "soprano_1",
          status: "pending"
        });
      }
    }
  }, [isOpen, initialValues, form]);

  const onSubmit = async (data: UserFormValues) => {
    await onMemberAdd(data);
  };

  const roleOptions = [
    { label: "Singer", value: "singer" },
    { label: "Section Leader", value: "section_leader" },
    { label: "Administrator", value: "administrator" },
    { label: "Student Conductor", value: "student_conductor" },
    { label: "Accompanist", value: "accompanist" },
    { label: "Non-Singer", value: "non_singer" }
  ];

  const voicePartOptions = [
    { label: "Soprano 1", value: "soprano_1" },
    { label: "Soprano 2", value: "soprano_2" },
    { label: "Alto 1", value: "alto_1" },
    { label: "Alto 2", value: "alto_2" },
    { label: "Tenor", value: "tenor" },
    { label: "Bass", value: "bass" }
  ];

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Pending", value: "pending" },
    { label: "Inactive", value: "inactive" },
    { label: "Alumni", value: "alumni" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Member" : "Add New Member"}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Update member information in the database." 
              : "Add a new member to the Glee Club."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      {...field} 
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? "Password (leave blank to keep current)" : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={isEditing ? "••••••••" : "Create password"} 
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
                      placeholder="123-456-7890" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <RoleStatusSelect
                form={form}
                name="role"
                label="Role"
                options={roleOptions}
              />

              <RoleStatusSelect
                form={form}
                name="voice_part"
                label="Voice Part"
                options={voicePartOptions}
              />
            </div>

            <RoleStatusSelect
              form={form}
              name="status"
              label="Status"
              options={statusOptions}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  isEditing ? "Update Member" : "Add Member"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
