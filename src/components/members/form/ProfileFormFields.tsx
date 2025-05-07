
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserFormValues } from "./userFormSchema";

interface ProfileFormFieldsProps {
  form: UseFormReturn<UserFormValues>;
}

export const ProfileFormFields: React.FC<ProfileFormFieldsProps> = ({ form }) => {
  return (
    <>
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
      
      <FormField
        control={form.control}
        name="voice_part"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Part</FormLabel>
            <Select
              value={field.value || ''}
              onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice part" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">Not specified</SelectItem>
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
    </>
  );
};
