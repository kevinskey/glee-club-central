
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function UserSystemResetPage() {
  const { user, isLoading } = useAuth();
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the user system? This action cannot be undone.')) {
      return;
    }

    setResetting(true);
    try {
      // System reset logic here
      toast.success('System reset completed successfully');
    } catch (error) {
      toast.error('Failed to reset system');
    } finally {
      setResetting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            System Reset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/10 p-4 rounded border border-destructive/20">
            <h3 className="font-semibold mb-2">Warning</h3>
            <p className="text-sm">
              This action will reset all user data and cannot be undone. 
              Please ensure you have proper backups before proceeding.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">What will be reset:</h4>
            <ul className="text-sm space-y-1 ml-4">
              <li>• All user profiles</li>
              <li>• User permissions</li>
              <li>• User settings</li>
              <li>• Authentication data</li>
            </ul>
          </div>

          <Button 
            variant="destructive" 
            onClick={handleReset}
            disabled={resetting}
            className="w-full"
          >
            {resetting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Resetting System...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Reset User System
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
