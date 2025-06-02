
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Users, 
  Heart,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

export function DashboardTester() {
  const { user, profile, isAuthenticated, isAdmin, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const testDashboardAssignment = () => {
    console.log('🧪 DashboardTester: Testing dashboard assignment...');
    navigate('/dashboard');
  };

  const refreshAndTest = async () => {
    console.log('🔄 DashboardTester: Refreshing profile and testing...');
    await refreshProfile();
    setTimeout(() => navigate('/dashboard'), 500);
  };

  const getUserType = () => {
    if (!user || !profile) return 'Unknown';
    
    const isKnownAdmin = user.email === 'kevinskey@mac.com';
    const hasAdminAccess = isAdmin() || isKnownAdmin;
    
    if (hasAdminAccess) return 'Admin';
    if (profile.role === 'fan') return 'Fan';
    return 'Member';
  };

  const getExpectedDashboard = () => {
    const userType = getUserType();
    switch (userType) {
      case 'Admin': return '/admin';
      case 'Fan': return '/dashboard/fan';
      case 'Member': return '/dashboard/member';
      default: return '/dashboard/member';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Dashboard Assignment Tester
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Authentication Status</label>
            <div className="flex items-center gap-2 mt-1">
              {isAuthenticated ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Authenticated
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Authenticated
                </Badge>
              )}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">User Type</label>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">
                {getUserType() === 'Admin' && <Shield className="h-3 w-3 mr-1" />}
                {getUserType() === 'Member' && <User className="h-3 w-3 mr-1" />}
                {getUserType() === 'Fan' && <Heart className="h-3 w-3 mr-1" />}
                {getUserType()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Details</label>
          <div className="bg-muted p-3 rounded text-sm font-mono">
            <div>Email: {user?.email || 'N/A'}</div>
            <div>Role: {profile?.role || 'N/A'}</div>
            <div>Is Super Admin: {profile?.is_super_admin ? 'Yes' : 'No'}</div>
            <div>Admin Function: {isAdmin() ? 'Yes' : 'No'}</div>
            <div>Expected Dashboard: {getExpectedDashboard()}</div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex gap-2">
          <Button onClick={testDashboardAssignment} className="flex-1">
            <Users className="h-4 w-4 mr-2" />
            Test Dashboard Assignment
          </Button>
          
          <Button onClick={refreshAndTest} variant="outline" className="flex-1">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh & Test
          </Button>
        </div>

        {/* Direct Navigation */}
        <div className="pt-4 border-t">
          <label className="text-sm font-medium mb-2 block">Direct Navigation (For Testing)</label>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin')}
            >
              Admin Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/member')}
            >
              Member Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard/fan')}
            >
              Fan Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
