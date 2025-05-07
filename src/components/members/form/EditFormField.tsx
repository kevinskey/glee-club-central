
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserFormValues } from "./userFormSchema";

interface EditFormFieldProps {
  form: UseFormReturn<UserFormValues>;
  name: keyof UserFormValues;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
}

export const EditFormField: React.FC<EditFormFieldProps> = ({
  form,
  name,
  label,
  type = "text",
  placeholder = "",
  description,
}) => {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              type={type} 
              placeholder={placeholder} 
              {...field} 
              value={field.value || ''} 
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
