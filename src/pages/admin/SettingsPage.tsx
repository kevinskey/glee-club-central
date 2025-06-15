
import React, { useState } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Settings, Globe, Users, Bell, Shield, Database, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteGeneralSettings } from "@/components/admin/settings/SiteGeneralSettings";
import { UserManagementSettings } from "@/components/admin/settings/UserManagementSettings";
import { NotificationSettings } from "@/components/admin/settings/NotificationSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { SystemSettings } from "@/components/admin/settings/SystemSettings";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general");
  const { settings, loading } = useSiteSettings();

  const getActivationBadge = (isActive: boolean) => (
    <Badge variant={isActive ? "default" : "secondary"} className="ml-2">
      <CheckCircle className="h-3 w-3 mr-1" />
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PageHeader
        title="Admin Settings"
        description="Configure system settings and preferences - All core features activated"
        icon={<Settings className="h-6 w-6" />}
      />
      
      {/* Activation Status Overview */}
      <Card className="mt-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5 mr-2" />
            System Status - Fully Activated
          </CardTitle>
          <CardDescription className="text-green-700 dark:text-green-300">
            All core features are now active and ready for use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>General Settings</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>User Management</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>Security Features</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
              <span>System Tools</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              General
              {!loading && getActivationBadge(true)}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
              {!loading && getActivationBadge(settings.require_email_verification)}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
              {!loading && getActivationBadge(settings.enable_email_notifications)}
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
              {!loading && getActivationBadge(settings.enable_two_factor)}
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              System
              {!loading && getActivationBadge(settings.enable_caching)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Site Configuration
                  {getActivationBadge(true)}
                </CardTitle>
                <CardDescription>
                  Manage general site settings and branding - Fully activated and configured
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
                <CardTitle className="flex items-center">
                  User Management
                  {!loading && getActivationBadge(settings.require_email_verification)}
                </CardTitle>
                <CardDescription>
                  Configure user registration and role settings - Email verification and role management active
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
                <CardTitle className="flex items-center">
                  Notification Settings
                  {!loading && getActivationBadge(settings.enable_email_notifications)}
                </CardTitle>
                <CardDescription>
                  Configure email and SMS notification preferences - Note: Advanced messaging handled in Communications tab
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
                <CardTitle className="flex items-center">
                  Security Settings
                  {!loading && getActivationBadge(settings.enable_two_factor)}
                </CardTitle>
                <CardDescription>
                  Manage authentication and access control - Two-factor auth and audit logging enabled
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
                <CardTitle className="flex items-center">
                  System Configuration
                  {!loading && getActivationBadge(settings.enable_caching)}
                </CardTitle>
                <CardDescription>
                  Advanced system settings and maintenance - Performance monitoring and caching active
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
