
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

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: SelectOption[];
}

export const SelectField: React.FC<SelectFieldProps> = ({ 
  form, 
  name, 
  label, 
  options 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label}`} />
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

export const RoleSelect: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  const roleOptions = [
    { value: "member", label: "Member" },
    { value: "section_leader", label: "Section Leader" },
    { value: "Director", label: "Director" },
    { value: "Accompanist", label: "Accompanist" },
    { value: "admin", label: "Admin" },
  ];

  return <SelectField form={form} name="role" label="Role" options={roleOptions} />;
};

export const StatusSelect: React.FC<{ form: UseFormReturn<any> }> = ({ form }) => {
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "alumni", label: "Alumni" },
    { value: "pending", label: "Pending" },
  ];

  return <SelectField form={form} name="status" label="Status" options={statusOptions} />;
};
