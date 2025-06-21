import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, Mail, Phone, Users, Send } from "lucide-react";
import { useAdvancedMessaging } from "@/hooks/useAdvancedMessaging";
import { toast } from "sonner";

interface Member {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

interface MemberCommunicationActionsProps {
  member?: Member;
  members?: Member[];
  variant?: "single" | "bulk";
}

export function MemberCommunicationActions({
  member,
  members = [],
  variant = "single",
}: MemberCommunicationActionsProps) {
  const { isSending, sendMessage, sendBulkMessage } = useAdvancedMessaging();
  const [isOpen, setIsOpen] = useState(false);

  const handleSendEmail = async (type: "welcome" | "reminder" | "custom") => {
    if (variant === "single" && member) {
      if (!member.email) {
        toast.error("Member has no email address");
        return;
      }

      const templates = {
        welcome: {
          subject: `Welcome to Spelman Glee Club, ${member.first_name}!`,
          content: `Dear ${member.first_name},\n\nWelcome to the Spelman College Glee Club! We're excited to have you as part of our musical family.\n\nBest regards,\nSpelman Glee Club`,
        },
        reminder: {
          subject: "Upcoming Rehearsal Reminder",
          content: `Hi ${member.first_name},\n\nThis is a friendly reminder about our upcoming rehearsal. Please check the calendar for details.\n\nSee you there!\nSpelman Glee Club`,
        },
        custom: {
          subject: "Message from Spelman Glee Club",
          content: `Hello ${member.first_name},\n\nWe hope this message finds you well.\n\nBest regards,\nSpelman Glee Club`,
        },
      };

      const template = templates[type];
      await sendMessage({
        type: "email",
        to: member.email,
        subject: template.subject,
        content: template.content,
      });
    } else if (variant === "bulk" && members.length > 0) {
      const validMembers = members.filter((m) => m.email);
      if (validMembers.length === 0) {
        toast.error("No members have email addresses");
        return;
      }

      const template = {
        subject: "Message from Spelman Glee Club",
        content:
          "Hello {{first_name}},\n\nWe hope this message finds you well.\n\nBest regards,\nSpelman Glee Club",
      };

      await sendBulkMessage({
        type: "email",
        recipients: validMembers,
        subject: template.subject,
        content: template.content,
      });
    }
    setIsOpen(false);
  };

  const handleSendSMS = async () => {
    if (variant === "single" && member) {
      if (!member.phone) {
        toast.error("Member has no phone number");
        return;
      }

      await sendMessage({
        type: "sms",
        to: member.phone,
        content: `Hi ${member.first_name}, this is a message from Spelman Glee Club. Please check your email for more details.`,
      });
    } else if (variant === "bulk" && members.length > 0) {
      const validMembers = members.filter((m) => m.phone);
      if (validMembers.length === 0) {
        toast.error("No members have phone numbers");
        return;
      }

      await sendBulkMessage({
        type: "sms",
        recipients: validMembers,
        content:
          "Hi {{first_name}}, this is a message from Spelman Glee Club. Please check your email for more details.",
      });
    }
    setIsOpen(false);
  };

  const buttonText =
    variant === "single" ? "Message" : `Message ${members.length} Members`;
  const buttonIcon =
    variant === "single" ? (
      <MessageSquare className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isSending}>
          {buttonIcon}
          {isSending ? "Sending..." : buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleSendEmail("welcome")}>
          <Mail className="mr-2 h-4 w-4" />
          Send Welcome Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSendEmail("reminder")}>
          <Mail className="mr-2 h-4 w-4" />
          Send Reminder
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSendEmail("custom")}>
          <Send className="mr-2 h-4 w-4" />
          Send Custom Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendSMS}>
          <Phone className="mr-2 h-4 w-4" />
          Send SMS
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
