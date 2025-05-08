
import React, { useEffect, useState } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Mail, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserMessage {
  id: string;
  message_type: "email" | "sms";
  subject?: string;
  content: string;
  recipient: string;
  status: string;
  sent_at?: string;
  created_at: string;
}

export function MessageHistory() {
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getUserMessages } = useMessaging();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, success } = await getUserMessages(20);
      if (success) {
        setMessages(data as UserMessage[]);
      }
      setIsLoading(false);
    };

    fetchMessages();
  }, []);

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "Unknown";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Invalid date";
    }
  };

  const renderLoading = () => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="flex flex-col space-y-2 p-4 border rounded-md">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Message History</CardTitle>
        <CardDescription>Recent emails and SMS messages sent</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            renderLoading()
          ) : messages.length === 0 ? (
            <p className="text-center text-muted-foreground">No messages sent yet</p>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="p-4 border rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getMessageIcon(message.message_type)}
                    <span className="font-medium">
                      {message.message_type === "email" ? "Email" : "SMS"} to {message.recipient}
                    </span>
                  </div>
                  <Badge 
                    variant={message.status === "sent" ? "success" : "destructive"}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(message.status)}
                      {message.status}
                    </div>
                  </Badge>
                </div>
                {message.subject && (
                  <p className="font-medium mt-2">{message.subject}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {message.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Sent {formatTime(message.sent_at || message.created_at)}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
