
import { useState } from "react";
import { createUser } from "@/utils/admin";
import { toast } from "sonner";
import { useMessaging } from "@/hooks/useMessaging";
import { UserFormValues } from "@/components/members/form/userFormSchema";

export function useUserCreate(onSuccess: () => void) {
  const { sendEmail } = useMessaging();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Send welcome email to new users
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
      toast.error("User created, but welcome email could not be sent");
    }
  };

  // Handle create user submission
  const handleCreateUser = async (data: UserFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Creating user with data:", data);
      
      // Generate a temporary random password if not provided
      const tempPassword = data.password || Math.random().toString(36).slice(-8);
      
      // Create the user in Supabase
      const result = await createUser({
        email: data.email,
        password: tempPassword,
        first_name: data.first_name,
        last_name: data.last_name,
        role: data.role,
        status: data.status,
        voice_part: data.voice_part || null,
        phone: data.phone || null,
      });
      
      if (result.success) {
        // Send welcome email with password reset instructions
        await sendWelcomeEmail(data.email, data.first_name, tempPassword);
        
        toast.success(`User ${data.email} created successfully. Welcome email sent.`);
        
        // Refresh the user list
        onSuccess();
        setIsCreateUserOpen(false);
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isCreateUserOpen,
    setIsCreateUserOpen,
    isSubmitting,
    handleCreateUser
  };
}
