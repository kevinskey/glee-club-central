
import React from "react";
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
import { UserFormValues } from "./userFormSchema";

interface Option {
  value: string;
  label: string;
}

interface FormSelectFieldProps {
  form: UseFormReturn<UserFormValues>;
  name: keyof UserFormValues;
  label: string;
  placeholder: string;
  options: Option[];
  defaultValue?: string;
}

export const FormSelectField: React.FC<FormSelectFieldProps> = ({
  form,
  name,
  label,
  placeholder,
  options,
  defaultValue,
}) => {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value || defaultValue || options[0].value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
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
};
