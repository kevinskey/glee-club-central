
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { MessageSquare, Mail, Phone, Users, Send, Clock, Zap, Settings, Database, FileText } from "lucide-react";
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
import { ElasticEmailIntegration } from "@/components/admin/communications/ElasticEmailIntegration";
import { ElasticEmailComposer } from "@/components/admin/communications/ElasticEmailComposer";
import { ElasticEmailDataManager } from "@/components/admin/communications/ElasticEmailDataManager";

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
        <div className="w-full overflow-x-auto">
          <TabsList className="grid grid-cols-5 lg:grid-cols-9 w-full min-w-max gap-1">
            <TabsTrigger value="compose" className="flex items-center gap-2 text-xs lg:text-sm">
              <Send className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Bulk</span>
            </TabsTrigger>
            <TabsTrigger value="elastic-composer" className="flex items-center gap-2 text-xs lg:text-sm">
              <FileText className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Elastic</span>
            </TabsTrigger>
            <TabsTrigger value="quick-sms" className="flex items-center gap-2 text-xs lg:text-sm">
              <Zap className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">SMS</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2 text-xs lg:text-sm">
              <Mail className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 text-xs lg:text-sm">
              <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 text-xs lg:text-sm">
              <Users className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="internal" className="flex items-center gap-2 text-xs lg:text-sm">
              <MessageSquare className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Internal</span>
            </TabsTrigger>
            <TabsTrigger value="elastic-data" className="flex items-center gap-2 text-xs lg:text-sm">
              <Database className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 text-xs lg:text-sm">
              <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="compose" className="space-y-4">
          <BulkMessageComposer />
        </TabsContent>

        <TabsContent value="elastic-composer" className="space-y-4">
          <ElasticEmailComposer />
        </TabsContent>

        <TabsContent value="quick-sms" className="space-y-4">
          <QuickSMSComposer />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <MessageTemplateManager />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <MessageHistoryViewer />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <CommunicationAnalytics />
        </TabsContent>

        <TabsContent value="internal" className="space-y-4">
          <InternalMessaging />
        </TabsContent>

        <TabsContent value="elastic-data" className="space-y-4">
          <ElasticEmailDataManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
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
