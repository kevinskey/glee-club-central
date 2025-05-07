
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Profile, VoicePart, MemberStatus, UserRole } from "@/contexts/AuthContext";
import { useMessaging } from "@/hooks/useMessaging";
import { createUser } from "@/utils/adminUserOperations";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  voice_part: z.string().optional(),
  status: z.string().default("active"),
  role: z.string().default("Member"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: Profile) => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember,
}) => {
  const { sendEmail } = useMessaging();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      voice_part: "",
      status: "active",
      role: "Member",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // In a real implementation, we'll create the user via Supabase
      // Generate a random password that will be changed later
      const tempPassword = Math.random().toString(36).slice(-8);
      
      try {
        // Create the user in Supabase
        const result = await createUser({
          email: data.email,
          password: tempPassword,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          status: data.status as MemberStatus,
          voice_part: data.voice_part as VoicePart || null,
          phone: data.phone || null,
        });
        
        // For the UI, create a member profile with the returned ID
        const newMember: Profile = {
          id: result.userId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || null,
          voice_part: data.voice_part as VoicePart || null,
          role: data.role as UserRole,
          status: data.status as MemberStatus,
          join_date: new Date().toISOString().split('T')[0],
          avatar_url: null,
        };
        
        // Pass the new member to the parent component
        onAddMember(newMember);
        
        // Send welcome email with password reset instructions
        await sendWelcomeEmail(data.email, data.first_name, tempPassword);
        
        // Close the dialog
        onOpenChange(false);
        
        // Reset the form
        form.reset();
        
        toast.success("Member added successfully. Welcome email sent!");
      } catch (error: any) {
        console.error("Error creating user:", error);
        toast.error(error.message || "Failed to add member");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add member");
    }
  };

  // Send welcome email to the new member
  const sendWelcomeEmail = async (email: string, firstName: string, tempPassword: string) => {
    try {
      const emailContent = `
        <h2>Welcome to the Spelman College Glee Club!</h2>
        <p>Dear ${firstName},</p>
        <p>You have been added as a member to the Spelman College Glee Club system. To get started, please login using the following temporary password:</p>
        <p><strong>${tempPassword}</strong></p>
        <p>For security reasons, please change your password immediately after your first login.</p>
        <p>If you have any questions, please contact your administrator.</p>
        <p>Best regards,<br>Spelman College Glee Club</p>
      `;
      
      await sendEmail(email, "Welcome to Spelman College Glee Club", emailContent);
    } catch (error) {
      console.error("Error sending welcome email:", error);
      // We don't want to stop the flow if email fails, so just log it
      toast.error("Member added, but welcome email could not be sent");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Add a new member to the Spelman College Glee Club.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
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
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="voice_part"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Part</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Voice Part" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not_specified">None</SelectItem>
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
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="section_leader">Section Leader</SelectItem>
                        <SelectItem value="student_conductor">Student Conductor</SelectItem>
                        <SelectItem value="director">Director</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Member</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
