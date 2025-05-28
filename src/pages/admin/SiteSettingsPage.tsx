import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Settings } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

const SiteSettingsPage = () => {
  console.log('SiteSettingsPage component is rendering');
  
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const { settings, updateSetting, loading, error } = useSiteSettings();
  
  console.log('Auth state:', { isAdmin: isAdmin?.(), isLoading, isAuthenticated });
  console.log('Settings state:', { settings, loading, error });
  
  // Add visible debug info for iPad
  const debugInfo = {
    isLoading,
    isAuthenticated,
    isAdminFunc: typeof isAdmin,
    isAdminResult: isAdmin?.(),
    settingsLoading: loading,
    settingsError: error,
    settingsData: settings
  };
  
  // Redirect if user is not authenticated or not an admin
  if (!isLoading && (!isAuthenticated || !isAdmin())) {
    console.log('Redirecting to dashboard - not admin');
    return <Navigate to="/dashboard" />;
  }
  
  if (isLoading || loading) {
    console.log('Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <div className="ml-4 text-sm">
          <p>Loading... Auth: {isLoading ? 'loading' : 'done'}, Settings: {loading ? 'loading' : 'done'}</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main content');

  const handleNationalHolidaysToggle = async (enabled: boolean) => {
    try {
      console.log('Toggling national holidays to:', enabled);
      await updateSetting('show_national_holidays', enabled);
      toast.success('Calendar settings updated successfully');
    } catch (error) {
      console.error('Failed to update national holidays setting:', error);
      toast.error('Failed to update calendar settings');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Debug info for iPad */}
      <div className="bg-yellow-100 p-3 rounded text-xs mb-4">
        <p><strong>Debug Info:</strong></p>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>
      
      <PageHeader
        title="Site Settings"
        description="Configure system settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-3xl mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic site settings and information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" placeholder="Glee World" defaultValue="Glee World" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Input 
                    id="site-description" 
                    placeholder="Spelman College Glee Club Central Hub" 
                    defaultValue="Spelman College Glee Club Central Hub" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    placeholder="gleeclub@spelman.edu" 
                    defaultValue="gleeclub@spelman.edu" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="academic-year">Current Academic Year</Label>
                  <Select defaultValue="2024-2025">
                    <SelectTrigger id="academic-year">
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                      <SelectItem value="2026-2027">2026-2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calendar Settings</CardTitle>
                <CardDescription>
                  Configure calendar display options and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="show-holidays" className="text-base font-medium">Show National Holidays</Label>
                    <p className="text-sm text-muted-foreground">Display U.S. national holidays on the calendar</p>
                  </div>
                  <Switch 
                    id="show-holidays" 
                    checked={settings?.show_national_holidays !== false}
                    onCheckedChange={handleNationalHolidaysToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start">Light</Button>
                    <Button variant="outline" className="justify-start">Dark</Button>
                    <Button variant="outline" className="justify-start">System</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="h-8 rounded-md bg-orange-500 border cursor-pointer"></div>
                    <div className="h-8 rounded-md bg-red-500 border cursor-pointer"></div>
                    <div className="h-8 rounded-md bg-blue-500 border cursor-pointer"></div>
                    <div className="h-8 rounded-md bg-green-500 border cursor-pointer"></div>
                    <div className="h-8 rounded-md bg-purple-500 border cursor-pointer"></div>
                    <div className="h-8 rounded-md bg-pink-500 border cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="show-logo" defaultChecked />
                  <Label htmlFor="show-logo">Show logo in header</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="compact-sidebar" />
                  <Label htmlFor="compact-sidebar">Use compact sidebar by default</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                </div>
                <Switch id="push-notifications" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="event-reminders" className="text-base font-medium">Event Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders about upcoming events</p>
                </div>
                <Switch id="event-reminders" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure email templates and sending settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" placeholder="noreply@gleeworld.org" defaultValue="noreply@gleeworld.org" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reply-to">Reply-To Email</Label>
                <Input id="reply-to" placeholder="gleeclub@spelman.edu" defaultValue="gleeclub@spelman.edu" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-signature">Email Signature</Label>
                <Input id="email-signature" placeholder="Spelman College Glee Club" defaultValue="Spelman College Glee Club" />
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button>Save Email Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteSettingsPage;
