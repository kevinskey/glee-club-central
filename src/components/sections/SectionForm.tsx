
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Section } from "@/utils/supabaseQueries";

// Schema that matches our expected section data structure
const sectionFormSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  description: z.string().optional(),
  section_leader_id: z.string().optional(),
});

export type SectionFormValues = z.infer<typeof sectionFormSchema>;

interface SectionFormProps {
  section: Section | null;
  leaders: { id: string; name?: string }[];
  onSubmit: (values: SectionFormValues) => Promise<void>;
}

export function SectionForm({ section, leaders, onSubmit }: SectionFormProps) {
  const form = useForm<SectionFormValues>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: section?.name || "",
      description: section?.description || "",
      section_leader_id: section?.section_leader_id || "",
    },
  });

  // Update form values when editing section
  useEffect(() => {
    if (section) {
      form.reset({
        name: section.name,
        description: section.description || "",
        section_leader_id: section.section_leader_id || "",
      });
    }
  }, [section, form]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{section ? "Edit Section" : "Add New Section"}</DialogTitle>
        <DialogDescription>
          {section ? "Update section details" : "Create a new choir section or group"}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. First Soprano" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Brief description of this section"
                    className="min-h-[80px]"
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section_leader_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Section Leader (Optional)</FormLabel>
                <Select 
                  value={field.value || "no_leader"} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section leader" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="no_leader">None</SelectItem>
                    {leaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id}>
                        {leader.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {section ? "Save Changes" : "Add Section"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
