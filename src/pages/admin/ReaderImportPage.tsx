
import React from 'react';
import { ReaderImportManager } from '@/components/admin/ReaderImportManager';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ReaderImportPage() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Admin privileges required to access the Reader Import Manager.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-[#003366] dark:text-white">
          Reader Import Manager
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Import content from reader.gleeworld.org into the main application
        </p>
      </div>

      <ReaderImportManager />
    </div>
  );
}
