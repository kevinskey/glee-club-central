
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteGeneralSettings } from "@/components/admin/settings/SiteGeneralSettings";
import { UserManagementSettings } from "@/components/admin/settings/UserManagementSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { SystemSettings } from "@/components/admin/settings/SystemSettings";
import { TickerManagement } from "@/components/admin/TickerManagement";

const SiteSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PageHeader
        title="Site Settings"
        description="Configure system settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="ticker">News Ticker</TabsTrigger>
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

          <TabsContent value="ticker">
            <Card>
              <CardHeader>
                <CardTitle>News Ticker Management</CardTitle>
                <CardDescription>
                  Configure the homepage news ticker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TickerManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SiteSettingsPage;
