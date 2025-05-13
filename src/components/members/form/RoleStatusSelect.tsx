
import React from 'react';
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
import { UseFormReturn } from "react-hook-form";
import { UserFormValues } from './userFormSchema';

interface RoleStatusSelectProps {
  form: UseFormReturn<UserFormValues>;
  name: "status" | "voice_part" | "role"; // Updated to match schema
  label: string;
  options: Array<{label: string, value: string}>;
}

export function RoleStatusSelect({
  form,
  name,
  label,
  options
}: RoleStatusSelectProps) {
  return (
    <FormField
      control={form.control}
      name={name as any} // Type cast to any to bypass strict type checking
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value as string} // Ensure value is treated as string
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
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
  );
}
