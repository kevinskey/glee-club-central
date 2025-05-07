
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
import { UserFormValues } from "./userFormSchema";
import { EditFormField } from "./EditFormField";

interface EditProfileTabContentProps {
  form: UseFormReturn<UserFormValues>;
}

export const EditProfileTabContent: React.FC<EditProfileTabContentProps> = ({ form }) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <EditFormField
          form={form}
          name="first_name"
          label="First Name"
          placeholder="First name"
        />
        
        <EditFormField
          form={form}
          name="last_name"
          label="Last Name"
          placeholder="Last name"
        />
      </div>
      
      <EditFormField
        form={form}
        name="phone"
        label="Phone Number"
        placeholder="Phone number"
      />
      
      <FormField
        control={form.control}
        name="voice_part"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Voice Part</FormLabel>
            <Select
              value={field.value || 'not_specified'}
              onValueChange={(value) => field.onChange(value === 'not_specified' ? null : value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice part" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="not_specified">Not specified</SelectItem>
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
