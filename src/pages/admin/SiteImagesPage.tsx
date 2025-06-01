
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Image, Upload, Trash2, Settings } from 'lucide-react';
import { PageLoader } from '@/components/ui/page-loader';
import { toast } from 'sonner';

export default function SiteImagesPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: profileLoading } = useProfile();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const isUserAdmin = isAdmin;

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      // Mock loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImages([]);
      setLoading(false);
    };

    if (user && isUserAdmin) {
      loadImages();
    }
  }, [user, isUserAdmin]);

  if (authLoading || profileLoading || loading) {
    return <PageLoader message="Loading site images..." />;
  }

  if (!user || !isUserAdmin) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Admin Access Required</h3>
          <p className="text-muted-foreground">
            You must be an administrator to manage site images.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    try {
      // Mock upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Images</h1>
        <p className="text-muted-foreground">
          Manage images used throughout the Glee World website
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Image</CardTitle>
          <CardDescription>
            Add new images to be used on the website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-upload">Select Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </div>
            {uploading && (
              <Alert>
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  Uploading image, please wait...
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Current Site Images</CardTitle>
          <CardDescription>
            Manage existing images
          </CardDescription>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-12">
              <Image className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Images Uploaded</h3>
              <p className="text-muted-foreground">
                Upload your first image to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // Handle image deletion
                        toast.success('Image deleted successfully');
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-center truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
