
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSelectField } from "./FormSelectField";
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from "./userFormSchema";

interface ProfileTabContentProps {
  form: UseFormReturn<UserFormValues>;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({ form }) => {
  const voicePartOptions = [
    { value: "not_specified", label: "Not specified" },
    { value: "soprano", label: "Soprano" },
    { value: "alto", label: "Alto" },
    { value: "tenor", label: "Tenor" },
    { value: "bass", label: "Bass" }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input placeholder="Phone number" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormSelectField
        form={form}
        name="voice_part"
        label="Voice Part"
        placeholder="Select voice part"
        options={voicePartOptions}
        defaultValue="not_specified"
      />
    </div>
  );
};
