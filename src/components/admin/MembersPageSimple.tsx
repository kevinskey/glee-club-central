
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Plus, 
  Upload, 
  RefreshCw, 
  AlertCircle
} from 'lucide-react';
import { CleanMembersPage } from '@/components/members/CleanMembersPage';
import { MemberBulkUpload } from './MemberBulkUpload';
import { useAuthMigration } from '@/hooks/useAuthMigration';

export default function MembersPageSimple() {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const { isAdmin } = useAuthMigration();

  const handleBulkUploadComplete = () => {
    setShowBulkUpload(false);
    // Refresh the members list
    window.location.reload();
  };

  // Show bulk upload view
  if (showBulkUpload) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setShowBulkUpload(false)} variant="outline">
            ← Back to Members
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Bulk Upload Members</h1>
            <p className="text-muted-foreground">Import multiple members from a CSV file</p>
          </div>
        </div>
        
        <div className="max-w-4xl">
          <MemberBulkUpload onMembersUploaded={handleBulkUploadComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage Glee Club members</p>
        </div>
        
        {isAdmin() && (
          <div className="flex gap-2">
            <Button onClick={() => setShowBulkUpload(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
          </div>
        )}
      </div>

      <CleanMembersPage />
    </div>
  );
}
