
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { PageHeader } from "@/components/ui/page-header";
import { Settings, Globe, Bell, Shield, User, Mail } from "lucide-react";
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

export default function AdminSettingsPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  
  // Redirect if user is not authenticated or not an admin
  if (!isLoading && (!isAuthenticated || !isAdmin())) {
    return <Navigate to="/dashboard" />;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Site Settings"
        description="Configure system settings and preferences"
        icon={<Settings className="h-6 w-6" />}
      />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
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
              
              <div className="flex items-center justify-between pt-2">
                <Button>Save Appearance</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Event Reminders</p>
                    <p className="text-sm text-muted-foreground">Send reminders before scheduled events</p>
                  </div>
                  <Switch id="event-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Music Alerts</p>
                    <p className="text-sm text-muted-foreground">Notify members when new sheet music is uploaded</p>
                  </div>
                  <Switch id="music-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dues Reminders</p>
                    <p className="text-sm text-muted-foreground">Send reminders about unpaid dues</p>
                  </div>
                  <Switch id="dues-reminders" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Announcements</p>
                    <p className="text-sm text-muted-foreground">Important system updates and announcements</p>
                  </div>
                  <Switch id="system-announcements" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send all notifications via email</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button>Update Notification Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure what different user roles can access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Role to Configure</Label>
                  <Select defaultValue="section_leader">
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="administrator">Administrator</SelectItem>
                      <SelectItem value="section_leader">Section Leader</SelectItem>
                      <SelectItem value="student_conductor">Student Conductor</SelectItem>
                      <SelectItem value="singer">Singer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md p-4 space-y-3">
                  <h4 className="font-medium">Section Leader Permissions</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-view-all-members">View all member details</Label>
                    <Switch id="can-view-all-members" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-take-attendance">Take attendance</Label>
                    <Switch id="can-take-attendance" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-upload-music">Upload sheet music</Label>
                    <Switch id="can-upload-music" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-send-announcements">Send section announcements</Label>
                    <Switch id="can-send-announcements" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-edit-calendar">Edit calendar events</Label>
                    <Switch id="can-edit-calendar" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="can-manage-wardrobe">Manage section wardrobe</Label>
                    <Switch id="can-manage-wardrobe" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button>Save Permission Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>
                Configure email notification templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Email Template</Label>
                  <Select defaultValue="welcome">
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="welcome">Welcome Email</SelectItem>
                      <SelectItem value="event_reminder">Event Reminder</SelectItem>
                      <SelectItem value="dues_reminder">Dues Reminder</SelectItem>
                      <SelectItem value="new_music">New Music Notification</SelectItem>
                      <SelectItem value="announcement">General Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject</Label>
                  <Input id="email-subject" defaultValue="Welcome to Spelman College Glee Club!" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-content">Email Content</Label>
                  <textarea 
                    id="email-content"
                    className="w-full min-h-[200px] p-3 border rounded-md resize-y"
                    defaultValue={`Dear {first_name},\n\nWelcome to the Spelman College Glee Club! We are delighted to have you join our musical family.\n\nYour account has been created, and you can now log in to access all member resources at GleeWorld.\n\nPlease complete your profile information and review the member handbook at your earliest convenience.\n\nBest regards,\nThe Glee Club Administrative Team`}
                  ></textarea>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch id="email-active" defaultChecked />
                  <Label htmlFor="email-active">Template active</Label>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline">Send Test Email</Button>
                <Button>Save Template</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
