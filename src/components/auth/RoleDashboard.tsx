import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  Music, 
  Settings, 
  BarChart3, 
  UserCog,
  BookOpen,
  Headphones
} from 'lucide-react';

export function RoleDashboard() {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">
          Welcome, {profile?.first_name || user?.email}!
        </h2>
        <p className="text-gray-500">
          {isAdmin() ? 'Admin Dashboard' : 'Member Dashboard'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin() ? (
          <>
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Manage Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Create, edit, and manage user accounts.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/admin/user-management')}>
                  Go to User Management
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Manage Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Create, edit, and manage calendar events.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/admin/calendar')}>
                  Go to Calendar
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Manage site-wide settings and configurations.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/admin/site-settings')}>
                  Go to Site Settings
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Sheet Music
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Access and download sheet music for practice.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/sheet-music')}>
                  View Sheet Music
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5" />
                  Practice Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Access practice logs, stats, and sight reading tools.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/practice')}>
                  Go to Practice Tools
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  View upcoming events and rehearsals.
                </p>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => navigate('/calendar')}>
                  View Calendar
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Button variant="destructive" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
