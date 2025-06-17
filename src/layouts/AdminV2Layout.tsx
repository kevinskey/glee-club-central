
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminV2LayoutProps {
  children: React.ReactNode;
}

export const AdminV2Layout: React.FC<AdminV2LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();

  const isMainDashboard = location.pathname === '/admin/v2';

  const handleBackToDashboard = () => {
    try {
      navigate('/admin/v2');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/admin/v2';
    }
  };

  const handleViewSite = () => {
    try {
      navigate('/');
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {!isMainDashboard && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    GleeWorld Admin
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {profile?.first_name || 'Admin'}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewSite}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                View Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
