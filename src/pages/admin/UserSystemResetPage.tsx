import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export default function UserSystemResetPage() {
  const { user, logout } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const handleReset = async () => {
    setResetting(true);
    setResetStatus(null);

    try {
      // Simulate a system reset process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // After the reset, log the user out
      await logout();

      setResetStatus('System reset successful. You have been logged out.');
    } catch (error: any) {
      console.error('System reset failed:', error);
      setResetStatus(`System reset failed: ${error.message}`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>User System Reset</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This action will reset the entire user system and log you out.
            Are you sure you want to proceed?
          </p>
          {resetStatus && (
            <div className="mb-4">
              <p className="text-sm">{resetStatus}</p>
            </div>
          )}
          <Button
            variant="destructive"
            onClick={handleReset}
            disabled={resetting}
          >
            {resetting ? 'Resetting...' : 'Reset System'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

