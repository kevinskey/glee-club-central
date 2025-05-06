
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
    if (!user) {
      toast.error("You must be logged in to send messages");
      return { success: false };
    }

    setIsSending(true);
    try {
      const endpoint = type === "email" ? "send-email" : "send-sms";
      
      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: {
          to,
          subject: subject || "",
          content,
          userId: user.id
        }
      });

      if (error) throw error;

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
