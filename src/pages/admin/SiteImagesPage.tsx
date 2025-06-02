import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { listSiteImages, uploadSiteImage, deleteSiteImage, SiteImage } from '@/utils/siteImages';
import { Upload, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function SiteImagesPage() {
  const { user, isLoading } = useAuth();
  const { isAdmin, isLoading: profileLoading } = useProfile();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    name: '',
    description: '',
    category: 'general'
  });

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const imagesData = await listSiteImages(selectedCategory === 'all' ? undefined : selectedCategory);
      setImages(imagesData);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.name) {
      toast.error("Please select a file and enter a name");
      return;
    }

    try {
      const result = await uploadSiteImage({
        file: uploadData.file,
        name: uploadData.name,
        description: uploadData.description,
        category: uploadData.category
      });

      if (result.success) {
        toast.success("Image uploaded successfully");
        setIsUploadDialogOpen(false);
        setUploadData({ file: null, name: '', description: '', category: 'general' });
        fetchImages();
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const result = await deleteSiteImage(id);
      if (result.success) {
        fetchImages();
      } else {
        toast.error(result.error || "Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  const categories = ['all', 'hero', 'general', 'events', 'gallery'];

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin()) {
    return <div>Access denied</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Site Images Management</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </div>

      <div className="mb-6">
        <Label htmlFor="category-filter">Filter by Category</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="hero">Hero Images</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="events">Events</SelectItem>
            <SelectItem value="gallery">Gallery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="aspect-video bg-gray-100 rounded mb-4 overflow-hidden">
                <img
                  src={image.file_url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold">{image.name}</h3>
              <p className="text-sm text-muted-foreground">{image.description}</p>
              <p className="text-xs text-muted-foreground">Category: {image.category}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(image.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file">Image File</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={uploadData.name}
                onChange={(e) => setUploadData({...uploadData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={uploadData.description}
                onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={uploadData.category} onValueChange={(value) => setUploadData({...uploadData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="hero">Hero Images</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpload} className="w-full">
              Upload Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
