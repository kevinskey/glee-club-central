
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendMessageParams {
  type: "email" | "sms";
  to: string;
  subject?: string;
  content: string;
}

export function useMessaging() {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendMessage = async ({ type, to, subject, content }: SendMessageParams) => {
    // For email sending during registration, we may not have a user yet
    // So we'll allow sending without checking for user in that case
    const isRegistrationEmail = !user && type === "email" && subject?.includes("Welcome");
    
    if (!user && !isRegistrationEmail) {
      toast.error("You must be logged in to send messages");
      return { success: false };
    }

    setIsSending(true);
    try {
      const endpoint = type === "email" ? "send-email" : "send-sms";
      
      console.log(`Sending ${type} via ${endpoint} function...`);
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: {
          to,
          subject: subject || "",
          content,
          userId: user?.id || "registration" // Handle case when sending during registration
        }
      });

      if (error) {
        console.error(`Error response from ${endpoint}:`, error);
        throw error;
      }

      console.log(`${type} sent successfully:`, data);
      toast.success(`${type === "email" ? "Email" : "SMS"} sent successfully!`);
      return { success: true, data };
    } catch (error: any) {
      console.error(`Error sending ${type}:`, error);
      toast.error(`Failed to send ${type}: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  const getUserMessages = async (limit = 10) => {
    if (!user) return { data: [], success: false };
    
    try {
      const { data, error } = await supabase
        .from("user_messages")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      return { data, success: true };
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      return { data: [], success: false, error };
    }
  };

  return {
    isSending,
    sendEmail: (to: string, subject: string, content: string) => 
      sendMessage({ type: "email", to, subject, content }),
    sendSMS: (to: string, content: string) => 
      sendMessage({ type: "sms", to, content }),
    getUserMessages
  };
}
