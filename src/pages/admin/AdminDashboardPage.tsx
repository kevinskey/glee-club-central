
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import { EventTimeline } from "@/components/admin/EventTimeline";
import { QuickActions } from "@/components/admin/QuickActions";
import { AdminMembersList } from "@/components/admin/AdminMembersList";
import { AnalyticsCard } from "@/components/admin/AnalyticsCard";
import { UserCountCard } from "@/components/admin/UserCountCard";
import { useUserManagement } from "@/hooks/useUserManagement";
import { Spinner } from "@/components/ui/spinner";

export default function AdminDashboardPage() {
  const { users, isLoading, fetchUsers } = useUserManagement();
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Admin Dashboard"
        description="Welcome to the Spelman College Glee Club administration panel."
      />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <UserCountCard />
            <AnalyticsCard 
              title="Active Members"
              value={users.filter(u => u.status === 'active').length.toString()}
              description="Currently active members"
              icon="users"
              isLoading={isLoading}
            />
            <AnalyticsCard 
              title="Recent Logins"
              value={users.filter(u => {
                if (!u.last_sign_in_at) return false;
                const lastWeek = new Date();
                lastWeek.setDate(lastWeek.getDate() - 7);
                return new Date(u.last_sign_in_at) >= lastWeek;
              }).length.toString()}
              description="Users logged in this week"
              icon="userCheck"
              isLoading={isLoading}
            />
            <AnalyticsCard 
              title="Dues Paid"
              value={users.filter(u => u.dues_paid).length.toString()}
              description="Members with dues paid"
              icon="wallet"
              isLoading={isLoading}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest club activity and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventTimeline />
              </CardContent>
            </Card>
            
            <div className="space-y-4 lg:col-span-3">
              <QuickActions />
              
              {isLoading ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Members</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center p-6">
                    <Spinner size="lg" />
                  </CardContent>
                </Card>
              ) : (
                <AdminMembersList members={users} />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Glee Club Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and member statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] sm:h-[400px]">
              {/* Analytics content would go here */}
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Analytics dashboard coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
