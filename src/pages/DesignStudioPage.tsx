
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/ui/page-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Lock, Settings, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function DesignStudioPage() {
  const { user, profile, isLoading, isAuthenticated, isAdmin, refreshProfile } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <PageLoader message="Loading design studio..." className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleEnableEcommerce = async () => {
    if (!profile?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ecommerce_enabled: true })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast.success('E-commerce access enabled!');
      await refreshProfile();
    } catch (error) {
      console.error('Error enabling e-commerce:', error);
      toast.error('Failed to enable e-commerce access');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <Lock className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Design Studio Not Available</CardTitle>
              <CardDescription className="text-base">
                The design studio feature has been temporarily removed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Available alternatives:
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Browse existing merchandise in the store
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Access admin panel for other features
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact administrators for custom designs
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    onClick={() => navigate('/store')}
                    className="w-full"
                  >
                    Browse Store
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="w-full"
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/admin')}
                  className="text-sm"
                >
                  Go to Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
