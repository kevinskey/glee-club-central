
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Upload, Download, UserPlus, Heart, TestTube } from 'lucide-react';
import { UserManagementSimplified } from '@/components/admin/UserManagementSimplified';
import { MemberCSVUpload } from '@/components/members/MemberCSVUpload';
import { MemberCSVDownload } from '@/components/members/MemberCSVDownload';
import { CreateUserModal } from '@/components/members/CreateUserModal';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { createTestUsers } from '@/utils/createTestUsers';

export default function UserManagementPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreatingTestUsers, setIsCreatingTestUsers] = useState(false);

  const handleUserCreated = () => {
    setShowCreateModal(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleCreateTestUsers = async () => {
    setIsCreatingTestUsers(true);
    try {
      await createTestUsers();
      // Refresh the user list after creation
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error creating test users:', error);
    } finally {
      setIsCreatingTestUsers(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="h-8 w-8" />
              Member Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage all member-related functions including registration, bulk uploads, and data export.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={handleCreateTestUsers} 
              disabled={isCreatingTestUsers}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              {isCreatingTestUsers ? 'Creating...' : 'Create Test Users'}
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="create">Create Member</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="fan-upload">Fan Upload</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <UserManagementSimplified key={refreshKey} />
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create Individual Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Add New Member</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new member account with all necessary details.
                </p>
                <Button onClick={() => setShowCreateModal(true)} size="lg">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create New Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="mt-6">
          <MemberCSVUpload />
        </TabsContent>

        <TabsContent value="fan-upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Fan Bulk Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Fan Upload Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Bulk fan upload functionality will be available in a future update.
                </p>
                <p className="text-sm text-muted-foreground">
                  For now, fans can be added individually through the regular member creation process with the "Fan" role.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <MemberCSVDownload />
        </TabsContent>
      </Tabs>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />
    </div>
  );
}
