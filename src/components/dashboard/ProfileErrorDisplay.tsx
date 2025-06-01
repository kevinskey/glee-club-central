
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, User } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface ProfileErrorDisplayProps {
  user: AuthUser;
  profileError: string;
  onRetry: () => void;
  onBackToLogin: () => void;
}

export function ProfileErrorDisplay({ user, profileError, onRetry, onBackToLogin }: ProfileErrorDisplayProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle>Profile Error</CardTitle>
          <CardDescription>
            {profileError}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              <span className="font-medium">User Details</span>
            </div>
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={onRetry}
              className="w-full"
            >
              Retry Loading Profile
            </Button>
            <Button 
              variant="outline" 
              onClick={onBackToLogin}
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
