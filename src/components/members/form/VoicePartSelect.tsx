
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

interface VoicePartSelectProps {
  form: UseFormReturn<any>;
}

export const VoicePartSelect: React.FC<VoicePartSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="voice_part"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Voice Part</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select Voice Part" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="Soprano 1">Soprano 1</SelectItem>
              <SelectItem value="Soprano 2">Soprano 2</SelectItem>
              <SelectItem value="Alto 1">Alto 1</SelectItem>
              <SelectItem value="Alto 2">Alto 2</SelectItem>
              <SelectItem value="Tenor">Tenor</SelectItem>
              <SelectItem value="Bass">Bass</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
