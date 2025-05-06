
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useMessaging } from "@/hooks/useMessaging";
import { Loader2, Mail, MessageSquare } from "lucide-react";

interface SendMessageFormProps {
  onSent?: () => void;
}

export function SendMessageForm({ onSent }: SendMessageFormProps) {
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { isSending, sendEmail, sendSMS } = useMessaging();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (activeTab === "email") {
      const result = await sendEmail(recipient, subject, message);
      success = result.success;
    } else {
      const result = await sendSMS(recipient, message);
      success = result.success;
    }
    
    if (success) {
      setRecipient("");
      setSubject("");
      setMessage("");
      if (onSent) onSent();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Message</CardTitle>
        <CardDescription>Communicate with choir members via email or SMS</CardDescription>
      </CardHeader>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
        <CardContent>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">To</Label>
              <Input 
                id="recipient" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)}
                placeholder={activeTab === "email" ? "email@example.com" : "+1234567890"}
                type={activeTab === "email" ? "email" : "tel"}
                required
              />
            </div>
            
            {activeTab === "email" && (
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Message subject"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                rows={5}
                required
              />
            </div>
            
            <CardFooter className="px-0 pt-4">
              <Button 
                type="submit" 
                disabled={isSending}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  `Send ${activeTab === "email" ? "Email" : "SMS"}`
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Tabs>
    </Card>
  );
}
