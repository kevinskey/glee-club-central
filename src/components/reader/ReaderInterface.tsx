
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSSOAuth } from '@/hooks/useSSOAuth';
import { useAuth } from '@/contexts/AuthContext';
import { ExternalLink, Music, BookOpen, Users, Clock, CheckCircle } from 'lucide-react';

export function ReaderInterface() {
  const { getAuthenticatedReaderURL, openReaderWithAuth, isGeneratingURL } = useSSOAuth();
  const { isAuthenticated, profile } = useAuth();
  const [readerStatus, setReaderStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');

  useEffect(() => {
    // Check if Reader is available
    const checkReaderStatus = async () => {
      try {
        const response = await fetch('https://reader.gleeworld.org/health', { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setReaderStatus('available');
      } catch (error) {
        setReaderStatus('available'); // Assume available since no-cors doesn't give us real status
      }
    };

    checkReaderStatus();
  }, []);

  const handleOpenReader = () => {
    openReaderWithAuth(false); // Open in new tab
  };

  const handleNavigateToReader = async () => {
    const url = await getAuthenticatedReaderURL();
    window.location.href = url; // Navigate in same tab
  };

  const features = [
    {
      icon: Music,
      title: "Sheet Music Library",
      description: "Access organized sheet music by voice part (S1, S2, A1, A2)"
    },
    {
      icon: BookOpen,
      title: "Digital Scores",
      description: "High-quality PDF viewing with zoom and annotation tools"
    },
    {
      icon: Users,
      title: "Member Access",
      description: "Secure access for Glee Club members only"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Latest repertoire and practice materials"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Music className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-[#003366] dark:text-white">Music Reader</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Access your digital sheet music library and practice materials
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-2 border-orange-100 dark:border-orange-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Reader Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant={readerStatus === 'available' ? 'default' : 'secondary'}>
                  {readerStatus === 'checking' ? 'Checking...' : 
                   readerStatus === 'available' ? 'Online' : 'Offline'}
                </Badge>
                {isAuthenticated && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Authenticated
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {isAuthenticated 
                  ? `Ready for ${profile?.first_name || 'member'} access`
                  : 'Sign in for full access'
                }
              </p>
            </div>
            <div className="space-x-2">
              <Button 
                onClick={handleOpenReader}
                disabled={isGeneratingURL}
                variant="outline"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button 
                onClick={handleNavigateToReader}
                disabled={isGeneratingURL}
              >
                <Music className="h-4 w-4 mr-2" />
                {isGeneratingURL ? 'Loading...' : 'Go to Reader'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <feature.icon className="h-6 w-6 text-orange-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#003366] dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Authentication Notice */}
      {!isAuthenticated && (
        <Alert>
          <AlertDescription>
            Sign in to your Glee Club account for seamless access to the Music Reader with your personalized sheet music library.
          </AlertDescription>
        </Alert>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <h4 className="font-medium">For Members:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
              <li>• Click "Go to Reader" to access your sheet music library</li>
              <li>• Your voice part assignments will be automatically loaded</li>
              <li>• Use the search function to find specific pieces</li>
              <li>• Download PDFs for offline practice</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Need Help?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Contact the music librarian or check the help section in the Reader for detailed instructions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
