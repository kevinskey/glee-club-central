
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Mail } from "lucide-react";
import { SendMessageForm } from "@/components/messaging/SendMessageForm";
import { MessageHistory } from "@/components/messaging/MessageHistory";

export default function MessagingPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Messaging"
        description="Send emails and SMS messages to choir members"
        icon={<Mail className="h-6 w-6" />}
      />
      
      <div className="grid gap-8 md:grid-cols-2">
        <SendMessageForm onSent={() => window.location.reload()} />
        <MessageHistory />
      </div>
    </div>
  );
}
