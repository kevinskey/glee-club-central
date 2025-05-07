
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Profile } from "@/contexts/AuthContext";
import { Section } from "@/utils/supabase/types";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { VoicePartSelect } from "./VoicePartSelect";
import { SectionSelect } from "./SectionSelect";
import { RoleSelect, StatusSelect } from "./RoleStatusSelect";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().nullable(),
  voice_part: z.string().optional().nullable(),
  section_id: z.string().optional().nullable(),
  status: z.string(),
  role: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface MemberEditFormProps {
  member: Profile;
  sections: Section[];
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel: () => void;
}

export const MemberEditForm: React.FC<MemberEditFormProps> = ({
  member,
  sections,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      voice_part: "",
      section_id: "",
      status: "active",
      role: "member",
    },
  });
  
  // Reset form when member changes
  useEffect(() => {
    if (member) {
      form.reset({
        first_name: member.first_name || "",
        last_name: member.last_name || "",
        email: member.email || "",
        phone: member.phone || "",
        voice_part: member.voice_part || "",
        section_id: member.section_id || "",
        status: member.status,
        role: member.role,
      });
    }
  }, [member, form]);

  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to update member");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <PersonalInfoFields form={form} />
        
        <div className="grid grid-cols-2 gap-4">
          <VoicePartSelect form={form} />
          <SectionSelect form={form} sections={sections} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <RoleSelect form={form} />
          <StatusSelect form={form} />
        </div>
        
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Update Member</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
