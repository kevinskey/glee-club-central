
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Settings, Globe, Users, Bell, Shield, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteGeneralSettings } from "@/components/admin/settings/SiteGeneralSettings";
import { UserManagementSettings } from "@/components/admin/settings/UserManagementSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { SystemSettings } from "@/components/admin/settings/SystemSettings";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PageHeader
        title="Admin Settings"
        description="Configure system settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Site Configuration</CardTitle>
                <CardDescription>
                  Manage general site settings and branding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SiteGeneralSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Configure user registration and role settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagementSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email and SMS notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NotificationSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage authentication and access control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecuritySettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Advanced system settings and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
