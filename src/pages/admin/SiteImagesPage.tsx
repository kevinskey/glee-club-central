import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Image, Save, Trash2, Eye, Download, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function SiteImagesPage() {
  const { user, isLoading } = useAuth();
  const { isAdmin, isLoading: profileLoading } = useProfile();

  const [images, setImages] = useState([
    { id: '1', name: 'Hero Image', url: '/placeholder-image.jpg', type: 'hero' },
    { id: '2', name: 'Logo', url: '/placeholder-logo.png', type: 'logo' },
  ]);
  const [newImage, setNewImage] = useState({ name: '', url: '', type: 'hero' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(''), 3000);
    }
    if (success) {
      setTimeout(() => setSuccess(''), 3000);
    }
  }, [error, success]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewImage({ ...newImage, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      const imageUrl = URL.createObjectURL(file);
      setNewImage({ ...newImage, url: imageUrl });
      setSuccess('Image uploaded successfully (preview only)');
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = () => {
    if (!newImage.name || !newImage.url) {
      setError('Please provide both name and URL.');
      return;
    }

    setImages([...images, { ...newImage, id: String(Date.now()) }]);
    setNewImage({ name: '', url: '', type: 'hero' });
    setSuccess('Image added successfully.');
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    setSuccess('Image deleted successfully.');
  };

  if (isLoading || profileLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin()) {
    return <div>You are not authorized to view this page.</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Image Management</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          {success && <Alert><AlertDescription>{success}</AlertDescription></Alert>}

          <Tabs defaultValue="manage" className="space-y-4">
            <TabsList>
              <TabsTrigger value="manage">Manage Images</TabsTrigger>
              <TabsTrigger value="add">Add Image</TabsTrigger>
            </TabsList>
            <TabsContent value="manage" className="space-y-4">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {images.map(image => (
                  <Card key={image.id}>
                    <CardHeader>
                      <CardTitle>{image.name}</CardTitle>
                      <Badge>{image.type}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="aspect-w-16 aspect-h-9">
                        <img src={image.url} alt={image.name} className="object-cover rounded-md" />
                      </div>
                      <div className="flex justify-end">
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(image.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="add" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" name="name" value={newImage.name} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select onValueChange={(value) => handleInputChange({ target: { name: 'type', value } } as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select image type" defaultValue={newImage.type} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="background">Background</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <Input type="file" id="image" name="image" onChange={handleImageUpload} />
                  {uploading && <p>Uploading...</p>}
                </div>
                {newImage.url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img src={newImage.url} alt="Preview" className="object-cover rounded-md" />
                  </div>
                )}
                <Button onClick={handleAddImage} disabled={uploading}>
                  Add Image
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
