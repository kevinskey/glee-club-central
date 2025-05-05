
import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { AudioCategory, getCategoriesInfo } from "./audioCategoryUtils";

interface AudioCategorySelectorProps {
  form: UseFormReturn<any>;
}

export function AudioCategorySelector({ form }: AudioCategorySelectorProps) {
  const categories = getCategoriesInfo();

  return (
    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Category</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-3"
            >
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent"
                >
                  <RadioGroupItem 
                    value={category.id} 
                    id={category.id} 
                  />
                  <Label 
                    htmlFor={category.id} 
                    className="flex flex-1 items-center gap-2 cursor-pointer"
                  >
                    {category.icon}
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
