
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Upload, Download, UserPlus } from 'lucide-react';
import { UserManagementSimplified } from '@/components/admin/UserManagementSimplified';
import { MemberCSVUpload } from '@/components/members/MemberCSVUpload';
import { MemberCSVDownload } from '@/components/members/MemberCSVDownload';
import { CreateUserModal } from '@/components/members/CreateUserModal';
import { Button } from '@/components/ui/button';

export default function UserManagementPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8" />
          Member Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage all member-related functions including registration, bulk uploads, and data export.
        </p>
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
          <UserManagementSimplified />
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
              <Button onClick={() => setShowCreateModal(true)} className="w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                Open Create Member Form
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Bulk Member Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MemberCSVUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fan-upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Fan Bulk Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Upload CSV files to register multiple fans at once.
              </p>
              <MemberCSVUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Member Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MemberCSVDownload />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={() => {
          setShowCreateModal(false);
          // Refresh members list if needed
        }}
      />
    </div>
  );
}
