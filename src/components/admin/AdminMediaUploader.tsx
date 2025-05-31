
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UploadImage {
  file: File;
  preview: string;
  title: string;
  heroTag: string;
  displayOrder: number;
  isHero: boolean;
}

const HERO_TAG_OPTIONS = [
  { value: "main-hero", label: "Main Hero" },
  { value: "event-hero", label: "Event Hero" },
  { value: "audio-hero", label: "Audio Hero" },
  { value: "store-hero", label: "Store Hero" }
];

export default function AdminMediaUploader() {
  const { user } = useAuth();
  const [uploadImages, setUploadImages] = useState<UploadImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast.error("Only image files (JPG, PNG, GIF) are allowed");
    }

    const newImages: UploadImage[] = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.')[0], // Remove extension
      heroTag: "main-hero",
      displayOrder: 0,
      isHero: false
    }));

    setUploadImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setUploadImages(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const updateImageMetadata = (index: number, field: keyof UploadImage, value: any) => {
    setUploadImages(prev => prev.map((img, i) => 
      i === index ? { ...img, [field]: value } : img
    ));
  };

  const validateForm = () => {
    if (uploadImages.length === 0) {
      toast.error("Please select at least one image to upload");
      return false;
    }

    for (const img of uploadImages) {
      if (!img.title.trim()) {
        toast.error("Please provide a title for all images");
        return false;
      }
    }

    return true;
  };

  const handleUpload = async () => {
    if (!validateForm() || !user?.id) return;

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const uploadImage of uploadImages) {
        // Generate unique filename
        const fileExt = uploadImage.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media-uploads')
          .upload(filePath, uploadImage.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('media-uploads')
          .getPublicUrl(filePath);

        // Insert into media_library table
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            title: uploadImage.title,
            file_path: filePath,
            file_url: publicUrlData.publicUrl,
            file_type: uploadImage.file.type,
            uploaded_by: user.id,
            is_hero: uploadImage.isHero,
            hero_tag: uploadImage.heroTag,
            display_order: uploadImage.displayOrder,
            size: uploadImage.file.size,
            is_public: true
          });

        if (dbError) throw dbError;
        successCount++;
      }

      toast.success(`Successfully uploaded ${successCount} image(s)`);
      clearForm();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload images: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const clearForm = () => {
    uploadImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadImages([]);
  };

  const handleConfirmUpload = () => {
    setShowConfirmDialog(false);
    handleUpload();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Media Uploader
        </CardTitle>
        <CardDescription>
          Upload images to the media library. These will be available in the Hero Manager for use across the site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* File Picker */}
        <div className="mb-6">
          <Label htmlFor="file-upload" className="block mb-2">Select Images</Label>
          <Input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Supports JPG, PNG, and GIF files. You can select multiple images at once.
          </p>
        </div>

        {/* Image Previews and Metadata */}
        {uploadImages.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">Images to Upload ({uploadImages.length})</h3>
            {uploadImages.map((uploadImage, index) => (
              <Card key={index} className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Image Preview */}
                  <div className="relative w-full md:w-32 h-32 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={uploadImage.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Metadata Form */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`title-${index}`}>Title</Label>
                      <Input
                        id={`title-${index}`}
                        value={uploadImage.title}
                        onChange={(e) => updateImageMetadata(index, 'title', e.target.value)}
                        placeholder="Image title"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`hero-tag-${index}`}>Hero Tag</Label>
                      <Select
                        value={uploadImage.heroTag}
                        onValueChange={(value) => updateImageMetadata(index, 'heroTag', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {HERO_TAG_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`display-order-${index}`}>Display Order</Label>
                      <Input
                        id={`display-order-${index}`}
                        type="number"
                        value={uploadImage.displayOrder}
                        onChange={(e) => updateImageMetadata(index, 'displayOrder', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`is-hero-${index}`}
                        checked={uploadImage.isHero}
                        onCheckedChange={(checked) => updateImageMetadata(index, 'isHero', checked)}
                      />
                      <Label htmlFor={`is-hero-${index}`}>Use as Hero Image</Label>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setShowConfirmDialog(true)}
            disabled={uploadImages.length === 0 || isUploading}
            className="flex-1"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {uploadImages.length} Image{uploadImages.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
          
          {uploadImages.length > 0 && (
            <Button variant="outline" onClick={clearForm} disabled={isUploading}>
              Clear All
            </Button>
          )}
        </div>

        {/* Empty State */}
        {uploadImages.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-md">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No images selected</h3>
            <p className="text-muted-foreground mb-4">
              Choose images to upload to the media library
            </p>
          </div>
        )}
      </CardContent>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upload {uploadImages.length} image{uploadImages.length !== 1 ? 's' : ''} to the media library?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpload}>
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
