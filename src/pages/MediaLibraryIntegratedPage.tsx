
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { ResponsiveMediaLibrary } from "@/components/media/ResponsiveMediaLibrary";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { LibraryIcon, Upload, Image, FileText } from "lucide-react";

const MediaLibraryIntegratedPage = () => {
  const { user, profile } = useAuth();
  const { hasPermission: legacyHasPermission } = usePermissions();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  console.log("MediaLibraryIntegratedPage - User:", user);
  console.log("MediaLibraryIntegratedPage - Profile:", profile);
  
  // Check permissions - temporarily simplify for debugging
  const canUpload = !!user;
  const canEdit = legacyHasPermission('can_edit_media');
  const canDelete = legacyHasPermission('can_delete_media');
  
  console.log("MediaLibraryIntegratedPage - Can upload:", canUpload);
  
  const { fetchAllMedia } = useMediaLibrary();

  const handleUploadComplete = () => {
    console.log("Upload complete, refreshing data");
    fetchAllMedia();
    setIsUploadModalOpen(false);
  };

  const handleOpenUploadModal = () => {
    console.log("Opening upload modal");
    setIsUploadModalOpen(true);
  };

  const mediaStats = [
    {
      title: 'Total Files',
      value: '247',
      icon: LibraryIcon,
      change: '+12 this week',
      color: 'text-blue-600'
    },
    {
      title: 'Images',
      value: '156',
      icon: Image,
      change: '63% of library',
      color: 'text-green-600'
    },
    {
      title: 'Documents',
      value: '42',
      icon: FileText,
      change: '17% of library',
      color: 'text-purple-600'
    },
    {
      title: 'Recent Uploads',
      value: '8',
      icon: Upload,
      change: 'This week',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white font-playfair">
          Media Library
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Media Management
        </Badge>
      </div>

      {/* Media Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {mediaStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                <CardTitle className="text-xs font-medium text-gray-900 dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-2">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="space-y-6">
        {/* Upload button for mobile/tablet friendly access */}
        {canUpload && (
          <div className="flex justify-end">
            <Button 
              onClick={handleOpenUploadModal}
              className="bg-[#0072CE] hover:bg-[#0072CE]/90 text-white min-h-[44px]"
            >
              Upload New Media
            </Button>
          </div>
        )}

        {/* Responsive Media Library */}
        <ResponsiveMediaLibrary
          isAdminView={canEdit || canDelete}
          showUpload={false} // We handle upload separately above
          onUploadComplete={handleUploadComplete}
        />
      </div>
      
      {/* Upload Modal */}
      {canUpload && (
        <UploadMediaModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
};

export default MediaLibraryIntegratedPage;
