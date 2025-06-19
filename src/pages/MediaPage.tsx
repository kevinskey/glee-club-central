
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { UploadMediaModal } from "@/components/UploadMediaModal";
import { ResponsiveMediaLibrary } from "@/components/media/ResponsiveMediaLibrary";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { LibraryIcon, Upload, Image, FileText, Music, Video } from "lucide-react";
import { useState } from 'react';

export default function MediaPage() {
  const { user, isAdmin } = useAuth();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  console.log("MediaPage - User:", user);
  
  const canUpload = !!user;
  
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
      title: 'Photos',
      value: '156',
      icon: Image,
      change: 'Performance shots',
      color: 'text-blue-600'
    },
    {
      title: 'Videos',
      value: '23',
      icon: Video,
      change: 'Performances & rehearsals',
      color: 'text-green-600'
    },
    {
      title: 'Audio',
      value: '42',
      icon: Music,
      change: 'Recordings & tracks',
      color: 'text-purple-600'
    },
    {
      title: 'Documents',
      value: '18',
      icon: FileText,
      change: 'Programs & notes',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <LibraryIcon className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-[#003366] dark:text-white">Media Library</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore photos, videos, and recordings from the Spelman College Glee Club
        </p>
      </div>

      {/* Media Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mediaStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow border-orange-100 dark:border-orange-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#003366] dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#003366] dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="space-y-6">
        {/* Upload button for authenticated users */}
        {canUpload && (
          <div className="flex justify-end">
            <Button 
              onClick={handleOpenUploadModal}
              className="bg-orange-500 hover:bg-orange-600 text-white min-h-[44px]"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Media
            </Button>
          </div>
        )}

        {/* Responsive Media Library */}
        <ResponsiveMediaLibrary
          isAdminView={isAdmin && isAdmin()}
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
}
