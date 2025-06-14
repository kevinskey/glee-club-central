
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendMessageParams {
  type: "email" | "sms" | "both";
  to: string | string[];
  subject?: string;
  content: string;
  template?: string;
  templateData?: Record<string, any>;
  scheduled?: Date;
}

interface BulkMessageParams {
  type: "email" | "sms" | "both";
  recipients: Array<{
    id: string;
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  }>;
  subject?: string;
  content: string;
  template?: string;
  templateData?: Record<string, any>;
}

export function useAdvancedMessaging() {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const sendMessage = async ({ type, to, subject, content, template, templateData, scheduled }: SendMessageParams) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return { success: false };
    }

    setIsSending(true);
    try {
      const recipients = Array.isArray(to) ? to : [to];
      const results = [];

      for (const recipient of recipients) {
        if (type === "email" || type === "both") {
          const emailResult = await supabase.functions.invoke("send-email", {
            body: {
              to: recipient,
              subject: subject || "",
              content,
              userId: user.id,
              template,
              templateData
            }
          });
          results.push({ type: "email", recipient, result: emailResult });
        }

        if (type === "sms" || type === "both") {
          const smsResult = await supabase.functions.invoke("send-sms", {
            body: {
              to: recipient,
              content,
              userId: user.id
            }
          });
          results.push({ type: "sms", recipient, result: smsResult });
        }
      }

      const successCount = results.filter(r => !r.result.error).length;
      const totalCount = results.length;

      if (successCount === totalCount) {
        toast.success(`All ${totalCount} messages sent successfully!`);
        return { success: true, results };
      } else {
        toast.warning(`${successCount}/${totalCount} messages sent successfully`);
        return { success: false, results };
      }
    } catch (error: any) {
      console.error("Error sending messages:", error);
      toast.error(`Failed to send messages: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  const sendBulkMessage = async ({ type, recipients, subject, content, template, templateData }: BulkMessageParams) => {
    if (!user) {
      toast.error("You must be logged in to send bulk messages");
      return { success: false };
    }

    setIsSending(true);
    try {
      console.log(`Sending bulk ${type} messages to ${recipients.length} recipients`);
      
      const results = [];
      const batchSize = 10; // Process in batches to avoid overwhelming the API

      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const batchPromises = batch.map(async (recipient) => {
          const batchResults = [];

          if ((type === "email" || type === "both") && recipient.email) {
            const personalizedContent = content
              .replace(/{{first_name}}/g, recipient.first_name || "Member")
              .replace(/{{last_name}}/g, recipient.last_name || "");

            const emailResult = await supabase.functions.invoke("send-email", {
              body: {
                to: recipient.email,
                subject: subject || "",
                content: personalizedContent,
                userId: user.id,
                template,
                templateData: { ...templateData, ...recipient }
              }
            });
            batchResults.push({ type: "email", recipient: recipient.email, result: emailResult });
          }

          if ((type === "sms" || type === "both") && recipient.phone) {
            const personalizedContent = content
              .replace(/{{first_name}}/g, recipient.first_name || "Member")
              .replace(/{{last_name}}/g, recipient.last_name || "");

            const smsResult = await supabase.functions.invoke("send-sms", {
              body: {
                to: recipient.phone,
                content: personalizedContent,
                userId: user.id
              }
            });
            batchResults.push({ type: "sms", recipient: recipient.phone, result: smsResult });
          }

          return batchResults;
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.flat());
      }

      const successCount = results.filter(r => !r.result.error).length;
      const totalCount = results.length;

      if (successCount === totalCount) {
        toast.success(`All ${totalCount} bulk messages sent successfully!`);
        return { success: true, results };
      } else {
        toast.warning(`${successCount}/${totalCount} bulk messages sent successfully`);
        return { success: false, results };
      }
    } catch (error: any) {
      console.error("Error sending bulk messages:", error);
      toast.error(`Failed to send bulk messages: ${error.message}`);
      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  const getMessageHistory = async (limit = 50) => {
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
      console.error("Error fetching message history:", error);
      return { data: [], success: false, error };
    }
  };

  const getMessageTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .eq("is_active", true)
        .order("name");
        
      if (error) throw error;
      
      return { data: data || [], success: true };
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      return { data: [], success: false, error };
    }
  };

  return {
    isSending,
    sendMessage,
    sendBulkMessage,
    getMessageHistory,
    getMessageTemplates,
    sendEmail: (to: string, subject: string, content: string) => 
      sendMessage({ type: "email", to, subject, content }),
    sendSMS: (to: string, content: string) => 
      sendMessage({ type: "sms", to, content }),
  };
}
