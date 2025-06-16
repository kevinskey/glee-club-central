
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { MessageSquare, Mail, Phone, Users, Send, Clock, Zap, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { BulkMessageComposer } from "@/components/admin/communications/BulkMessageComposer";
import { MessageTemplateManager } from "@/components/admin/communications/MessageTemplateManager";
import { MessageHistoryViewer } from "@/components/admin/communications/MessageHistoryViewer";
import { CommunicationAnalytics } from "@/components/admin/communications/CommunicationAnalytics";
import { InternalMessaging } from "@/components/admin/communications/InternalMessaging";
import { QuickSMSComposer } from "@/components/admin/communications/QuickSMSComposer";

const CommunicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("compose");
  const [messageStats, setMessageStats] = useState({
    totalSent: 0,
    emailsSent: 0,
    smsSent: 0,
    pendingMessages: 0
  });

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <PageHeader
          title="Communications Center"
          description="Manage email, SMS, and internal messaging for the Glee Club"
          icon={<MessageSquare className="h-6 w-6" />}
        />
        
        <Button 
          onClick={() => navigate('/admin/email-services')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Email Service Settings
        </Button>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Send className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{messageStats.totalSent}</p>
              <p className="text-sm text-muted-foreground">Total Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Mail className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{messageStats.emailsSent}</p>
              <p className="text-sm text-muted-foreground">Emails Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Phone className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{messageStats.smsSent}</p>
              <p className="text-sm text-muted-foreground">SMS Sent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold">{messageStats.pendingMessages}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Bulk
          </TabsTrigger>
          <TabsTrigger value="quick-sms" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick SMS
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="internal" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Internal
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <BulkMessageComposer />
        </TabsContent>

        <TabsContent value="quick-sms">
          <QuickSMSComposer />
        </TabsContent>

        <TabsContent value="templates">
          <MessageTemplateManager />
        </TabsContent>

        <TabsContent value="history">
          <MessageHistoryViewer />
        </TabsContent>

        <TabsContent value="analytics">
          <CommunicationAnalytics />
        </TabsContent>

        <TabsContent value="internal">
          <InternalMessaging />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Communication Settings</CardTitle>
              <CardDescription>
                Configure email and SMS service settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Service Management</h3>
                    <p className="text-sm text-muted-foreground">Configure Elastic Email, MailChimp, SendGrid, and other providers</p>
                  </div>
                  <Button onClick={() => navigate('/admin/email-services')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Services
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Twilio SMS</h3>
                    <p className="text-sm text-muted-foreground">SMS service provider</p>
                  </div>
                  <Badge variant="default">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunicationsPage;
