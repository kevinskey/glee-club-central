
import React, { useState, useEffect } from 'react';
import { useSimpleAuthContext } from '@/contexts/SimpleAuthContext';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useUsersSimplified } from '@/hooks/user/useUsersSimplified';
import { DatabaseDebugPanel } from './DatabaseDebugPanel';

export const UserManagementSimplified: React.FC = () => {
  const { user, isAuthenticated, isLoading, isAdmin } = useSimpleAuthContext();
  const { fetchUsers, isLoading: usersLoading, error, userCount } = useUsersSimplified();
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  console.log('🔍 UserManagementSimplified: Component state:', {
    isAuthenticated,
    isLoading,
    isAdminUser: isAdmin(),
    userEmail: user?.email,
    usersLoading,
    error,
    usersCount: userCount
  });

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log('🔄 UserManagementSimplified: Attempting to fetch users...');
      fetchUsers();
    }
  }, [isAuthenticated, isLoading, fetchUsers]);

  if (isLoading) {
    return <PageLoader message="Loading..." />;
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-muted-foreground">Please log in to access user management.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRefresh = () => {
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      {error && (
        <>
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Database Connection Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex gap-2">
                <Button onClick={handleRefresh} disabled={usersLoading}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                >
                  {showDebugPanel ? 'Hide' : 'Show'} Debug Panel
                </Button>
              </div>
            </CardContent>
          </Card>

          {showDebugPanel && <DatabaseDebugPanel />}
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {error ? 'Unable to load users due to connection error.' : `Found ${userCount} users.`}
              </p>
              {!error && (
                <Button onClick={handleRefresh} className="mt-4">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Users
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
