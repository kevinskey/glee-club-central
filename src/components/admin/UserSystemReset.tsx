
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RotateCcw, 
  Users, 
  Shield, 
  Database,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { roleResetService } from '@/services/roleResetService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function UserSystemReset() {
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    setResetComplete(false);
    
    try {
      // Reset user roles
      const roleResetSuccess = await roleResetService.resetUserRoles();
      
      if (roleResetSuccess) {
        // Clean up permissions
        await roleResetService.cleanupPermissions();
        
        setResetComplete(true);
        toast.success('User system has been reset successfully');
      } else {
        toast.error('Failed to reset user system');
      }
    } catch (error) {
      console.error('Error resetting user system:', error);
      toast.error('An error occurred while resetting the user system');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Reset User System
          </CardTitle>
          <CardDescription>
            This will reset all user roles and permissions to their default state. Use with extreme caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Reset all users to "member" role</li>
                <li>Remove admin privileges from all users except kevinskey@mac.com</li>
                <li>Clean up all existing permissions</li>
                <li>Initialize basic member permissions for all users</li>
              </ul>
              This action cannot be undone.
            </AlertDescription>
          </Alert>

          {resetComplete && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                User system reset completed successfully. All users have been reset to default member status.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium text-sm">User Roles</p>
                <p className="text-xs text-muted-foreground">Reset to member</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium text-sm">Admin Access</p>
                <p className="text-xs text-muted-foreground">One super admin only</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium text-sm">Permissions</p>
                <p className="text-xs text-muted-foreground">Clean & reinitialize</p>
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full"
                disabled={isResetting}
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                    Resetting System...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset User System
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently reset all user roles, 
                  remove admin privileges from all users except kevinskey@mac.com, and 
                  clean up all existing permissions.
                  
                  <br /><br />
                  
                  <strong>Type "RESET" to confirm this action.</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReset}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Reset User System
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
