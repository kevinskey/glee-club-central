
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserFormValues } from "./userFormSchema";
import { EditFormField } from "./EditFormField";

interface EditAccountTabContentProps {
  form: UseFormReturn<UserFormValues>;
}

export const EditAccountTabContent: React.FC<EditAccountTabContentProps> = ({ form }) => {
  return (
    <>
      <EditFormField
        form={form}
        name="email"
        label="Email"
        placeholder="user@example.com"
      />
      
      <EditFormField
        form={form}
        name="password"
        label="Password"
        type="password"
        placeholder="Leave blank to keep current password"
        description="Only enter a new password if you want to change it"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="singer">Singer</SelectItem>
                  <SelectItem value="section_leader">Section Leader</SelectItem>
                  <SelectItem value="student_conductor">Student Conductor</SelectItem>
                  <SelectItem value="accompanist">Accompanist</SelectItem>
                  <SelectItem value="non_singer">Non-Singer</SelectItem>
                  <SelectItem value="administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};
