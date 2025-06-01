
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { useUserManagement } from "@/hooks/user/useUserManagement";

export const MemberCSVDownload: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { users, fetchUsers } = useUserManagement();

  const downloadUsersCSV = async () => {
    setIsDownloading(true);
    try {
      // Refresh users data
      await fetchUsers();
      
      if (users.length === 0) {
        toast.error("No users found to download");
        return;
      }

      // Create CSV headers
      const headers = [
        'FirstName',
        'LastName', 
        'Email',
        'Phone',
        'VoicePart',
        'Role',
        'Status',
        'ClassYear',
        'JoinDate',
        'DuesPaid',
        'CreatedAt'
      ];

      // Convert users to CSV rows
      const csvRows = users.map(user => [
        user.first_name || '',
        user.last_name || '',
        user.email || '',
        user.phone || '',
        user.voice_part || '',
        user.role || '',
        user.status || '',
        user.class_year || '',
        user.join_date || '',
        user.dues_paid ? 'Yes' : 'No',
        user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => 
          row.map(field => 
            // Escape quotes and wrap fields containing commas
            typeof field === 'string' && (field.includes(',') || field.includes('"')) 
              ? `"${field.replace(/"/g, '""')}"` 
              : field
          ).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `members_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Downloaded ${users.length} users to CSV file`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download users CSV");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Export Members
        </CardTitle>
        <CardDescription>
          Download all member data as a CSV file for backup or external use.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h4 className="font-medium">Export All Members</h4>
            <p className="text-sm text-muted-foreground">
              Download a CSV file containing all member information
            </p>
          </div>
          <Button 
            onClick={downloadUsersCSV}
            disabled={isDownloading}
            className="flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <Download className="h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download CSV
              </>
            )}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> The exported CSV will include all user data including names, emails, roles, and membership information. Handle this data securely and in accordance with privacy policies.</p>
        </div>
      </CardContent>
    </Card>
  );
};
