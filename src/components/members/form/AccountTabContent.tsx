
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelectField } from "./FormSelectField";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "./userFormSchema";

interface AccountTabContentProps {
  form: UseFormReturn<UserFormValues>;
}

export const AccountTabContent: React.FC<AccountTabContentProps> = ({ form }) => {
  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "section_leader", label: "Section Leader" },
    { value: "student_conductor", label: "Student Conductor" },
    { value: "accompanist", label: "Accompanist" },
    { value: "singer", label: "Singer" },
    { value: "member", label: "Member" }
  ];

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "alumni", label: "Alumni" }
  ];

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="user@example.com" {...field} />
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
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Create a strong password" {...field} />
            </FormControl>
            <FormDescription>
              Leave blank to generate a random password
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormSelectField
          form={form}
          name="role"
          label="Role"
          placeholder="Select a role"
          options={roleOptions}
          defaultValue="member"
        />
        
        <FormSelectField
          form={form}
          name="status"
          label="Status"
          placeholder="Select status"
          options={statusOptions}
          defaultValue="active"
        />
      </div>
    </div>
  );
};
