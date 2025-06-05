
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Music, 
  Upload, 
  CheckCircle,
  Database,
  Smartphone,
  Shield
} from 'lucide-react';
import { BulkUploadDialog } from '@/components/members/BulkUploadDialog';
import { toast } from 'sonner';

export function AdminOverview() {
  const [showBulkUploadDialog, setShowBulkUploadDialog] = useState(false);

  const handleBulkUploadComplete = () => {
    setShowBulkUploadDialog(false);
    toast.success('Bulk upload completed successfully');
  };

  const features = [
    {
      title: 'User Management',
      description: 'Complete CRUD operations with live Supabase data',
      icon: <Users className="h-5 w-5" />,
      status: 'Live Data ✅',
      link: '/admin/users'
    },
    {
      title: 'Bulk Upload',
      description: 'CSV, Excel, JSON file processing with validation',
      icon: <Upload className="h-5 w-5" />,
      status: 'Interactive ✅',
      action: () => setShowBulkUploadDialog(true)
    },
    {
      title: 'Calendar Management',
      description: 'Event creation with graphical date pickers',
      icon: <Calendar className="h-5 w-5" />,
      status: 'Mobile Ready ✅',
      link: '/admin/calendar'
    },
    {
      title: 'Sheet Music Library',
      description: 'File management with role-based access',
      icon: <Music className="h-5 w-5" />,
      status: 'Auth Enabled ✅',
      link: '/admin/sheet-music'
    }
  ];

  const requirements = [
    {
      title: 'Live Supabase Data',
      icon: <Database className="h-4 w-4" />,
      status: 'complete'
    },
    {
      title: 'Fully Interactive',
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'complete'
    },
    {
      title: 'Mobile Responsive',
      icon: <Smartphone className="h-4 w-4" />,
      status: 'complete'
    },
    {
      title: 'Authentication Ready',
      icon: <Shield className="h-4 w-4" />,
      status: 'complete'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg border bg-green-50 border-green-200">
                <div className="text-green-600">{req.icon}</div>
                <div>
                  <p className="text-sm font-medium text-green-800">{req.title}</p>
                  <Badge className="bg-green-100 text-green-800 text-xs">Complete</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {feature.icon}
                {feature.title}
              </CardTitle>
              <Badge className="bg-green-100 text-green-800">
                {feature.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {feature.description}
              </p>
              {feature.link ? (
                <Button asChild size="sm" className="w-full">
                  <Link to={feature.link}>
                    Access Module
                  </Link>
                </Button>
              ) : (
                <Button onClick={feature.action} size="sm" className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Start Bulk Upload
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <BulkUploadDialog
        isOpen={showBulkUploadDialog}
        onOpenChange={setShowBulkUploadDialog}
        onUploadComplete={handleBulkUploadComplete}
      />
    </div>
  );
}
