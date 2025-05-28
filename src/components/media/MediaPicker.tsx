
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
}

interface MediaPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  currentImageUrl?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentImageUrl = ''
}) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState(currentImageUrl);
  const [selectedImageUrl, setSelectedImageUrl] = useState(currentImageUrl);

  useEffect(() => {
    if (isOpen) {
      fetchMediaItems();
      setExternalUrl(currentImageUrl);
      setSelectedImageUrl(currentImageUrl);
    }
  }, [isOpen, currentImageUrl]);

  const fetchMediaItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('id, title, file_url, file_type')
        .like('file_type', 'image%')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media items:', error);
      toast.error('Failed to load media library');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `event-${Date.now()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-library')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('media-library')
        .getPublicUrl(filePath);

      // Save to media_library table
      const { error: dbError } = await supabase
        .from('media_library')
        .insert({
          title: selectedFile.name,
          file_path: filePath,
          file_url: urlData.publicUrl,
          file_type: selectedFile.type,
          folder: 'events'
        });

      if (dbError) throw dbError;

      toast.success('Image uploaded successfully');
      onSelect(urlData.publicUrl);
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectImage = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
  };

  const handleConfirmSelection = () => {
    onSelect(selectedImageUrl);
    onClose();
  };

  const handleUseExternalUrl = () => {
    if (externalUrl.trim()) {
      onSelect(externalUrl.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Event Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="url">External URL</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Loading images...</div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                        selectedImageUrl === item.file_url
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleSelectImage(item.file_url)}
                    >
                      <img
                        src={item.file_url}
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-2">
                        <p className="text-xs text-gray-600 truncate">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {mediaItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No images in media library</p>
                  </div>
                )}

                {selectedImageUrl && (
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection}>
                      Use Selected Image
                    </Button>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Choose Image File</Label>
              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleFileUpload} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload & Use'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="external-url">Image URL</Label>
              <Input
                id="external-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
              />
            </div>

            {externalUrl && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <img
                    src={externalUrl}
                    alt="Preview"
                    className="max-w-full h-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleUseExternalUrl}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Use External URL
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
