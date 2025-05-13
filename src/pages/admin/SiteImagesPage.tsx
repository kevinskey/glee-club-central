
import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, TrashIcon, FolderIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SiteImage, listSiteImages, uploadSiteImage, deleteSiteImage } from "@/utils/siteImages";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CATEGORIES = ["general", "hero", "about", "performances", "backgrounds", "press-kit"];

const SiteImagesPage = () => {
  const { isAdmin, user } = useAuth();
  const [images, setImages] = useState<SiteImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Form state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [imageCategory, setImageCategory] = useState("general");

  const loadImages = async () => {
    setIsLoading(true);
    let category = selectedTab !== "all" ? selectedTab : undefined;
    const imagesData = await listSiteImages(category);
    setImages(imagesData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, [selectedTab]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // Prefill name with file name without extension if empty
      if (!imageName) {
        const fileName = e.target.files[0].name.split('.').slice(0, -1).join('.');
        setImageName(fileName);
      }
    }
  };

  const handleImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile || !imageName) {
      toast.error("Missing fields", {
        description: "Please provide an image file and name"
      });
      return;
    }

    setUploadingImage(true);
    try {
      const result = await uploadSiteImage({
        file: imageFile,
        name: imageName,
        description: imageDescription,
        category: imageCategory
      });
      
      if (result.success) {
        toast.success("Image uploaded successfully");
        setImageFile(null);
        setImageName("");
        setImageDescription("");
        loadImages();
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const confirmDeleteImage = (id: string) => {
    setSelectedImage(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteImage = async () => {
    if (selectedImage) {
      const result = await deleteSiteImage(selectedImage);
      if (result.success) {
        loadImages();
      }
    }
    setDeleteDialogOpen(false);
    setSelectedImage(null);
  };

  if (!isAdmin) {
    return <div className="p-8">You don't have permission to access this page.</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <PageHeader
        title="Site Images"
        description="Upload and manage images for use throughout the site"
        icon={<ImageIcon className="h-6 w-6" />}
      />

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="all">All Images</TabsTrigger>
            {CATEGORIES.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Upload New Image</h2>
            <form onSubmit={handleImageUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageFile">Image File</Label>
                <Input 
                  id="imageFile" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  required 
                />
                {imageFile && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">
                      Selected file: {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                    </p>
                    {imageFile.type.startsWith('image/') && (
                      <div className="mt-2 w-32 h-32 border rounded overflow-hidden">
                        <img 
                          src={URL.createObjectURL(imageFile)} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageName">Image Name</Label>
                  <Input 
                    id="imageName" 
                    value={imageName} 
                    onChange={e => setImageName(e.target.value)} 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageCategory">Category</Label>
                  <select
                    id="imageCategory"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={imageCategory}
                    onChange={e => setImageCategory(e.target.value)}
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageDescription">Description (Optional)</Label>
                <Textarea 
                  id="imageDescription" 
                  value={imageDescription} 
                  onChange={e => setImageDescription(e.target.value)} 
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={uploadingImage || !imageFile}
              >
                {uploadingImage ? "Uploading..." : "Upload Image"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            {selectedTab === 'all' ? 'All Images' : `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Images`} 
            {!isLoading && <span className="text-sm font-normal text-muted-foreground ml-2">({images.length})</span>}
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <FolderIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No images found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(image => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="relative">
                    <img 
                      src={image.file_url} 
                      alt={image.name} 
                      className="w-full aspect-video object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => confirmDeleteImage(image.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium mb-1 truncate" title={image.name}>
                      {image.name}
                    </h3>
                    {image.category && (
                      <p className="text-xs text-muted-foreground mb-1">
                        Category: {image.category}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 text-xs"
                        onClick={() => {
                          navigator.clipboard.writeText(image.file_url);
                          toast.success("URL copied to clipboard");
                        }}
                      >
                        Copy URL
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        {new Date(image.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this image from the site.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SiteImagesPage;
