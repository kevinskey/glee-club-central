import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Package, Lock, Image, Wand2, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';
import { MediaPicker } from '@/components/media/MediaPicker';

interface StoreItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity_in_stock: number;
  image_url?: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function ProductManagement() {
  const { user, profile } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState('');
  const [aiDescriptionPrompt, setAiDescriptionPrompt] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity_in_stock: '',
    image_url: '',
    tags: '',
    is_active: true
  });

  const queryClient = useQueryClient();

  // Check if user has permission to manage shop
  const canManageShop = () => {
    if (!user || !profile) return false;
    
    // Create user object for permission checking
    const currentUser = {
      ...user,
      role_tags: profile?.role_tags || []
    };
    
    return hasPermission(currentUser, 'manage_shop') || profile?.is_super_admin;
  };

  const { data: storeItems, isLoading } = useQuery({
    queryKey: ['admin-store-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StoreItem[];
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (itemData: any) => {
      if (!canManageShop()) {
        throw new Error('Access denied: You do not have permission to manage store items');
      }
      
      const { error } = await supabase
        .from('store_items')
        .insert([{
          name: itemData.name,
          description: itemData.description || null,
          price: parseFloat(itemData.price),
          quantity_in_stock: parseInt(itemData.quantity_in_stock),
          image_url: itemData.image_url || null,
          tags: itemData.tags ? itemData.tags.split(',').map((tag: string) => tag.trim()) : [],
          is_active: itemData.is_active
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-store-items'] });
      toast.success('Store item created successfully');
      resetForm();
      setIsCreateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create store item');
      console.error(error);
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: any) => {
      if (!canManageShop()) {
        throw new Error('Access denied: You do not have permission to manage store items');
      }
      
      const { error } = await supabase
        .from('store_items')
        .update({
          name: itemData.name,
          description: itemData.description || null,
          price: parseFloat(itemData.price),
          quantity_in_stock: parseInt(itemData.quantity_in_stock),
          image_url: itemData.image_url || null,
          tags: itemData.tags ? itemData.tags.split(',').map((tag: string) => tag.trim()) : [],
          is_active: itemData.is_active
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-store-items'] });
      toast.success('Store item updated successfully');
      resetForm();
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update store item');
      console.error(error);
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!canManageShop()) {
        throw new Error('Access denied: You do not have permission to manage store items');
      }
      
      const { error } = await supabase
        .from('store_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-store-items'] });
      toast.success('Store item deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete store item');
      console.error(error);
    }
  });

  const generateProductImage = async () => {
    if (!aiImagePrompt.trim()) {
      toast.error('Please enter a description for the product image');
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      console.log('Generating product image with AI:', aiImagePrompt);
      
      const enhancedPrompt = `Professional product photography of ${aiImagePrompt}. Clean white background, studio lighting, high quality, commercial photography style, centered composition, sharp focus, professional e-commerce product shot.`;
      
      const { data, error } = await supabase.functions.invoke('generate-design-image', {
        body: { 
          prompt: enhancedPrompt,
          style: 'product'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.imageUrl) {
        setFormData(prev => ({ ...prev, image_url: data.imageUrl }));
        toast.success('Product image generated successfully!');
        setAiImagePrompt('');
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('AI image generation error:', error);
      toast.error(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateProductDescription = async () => {
    if (!aiDescriptionPrompt.trim()) {
      toast.error('Please enter some details about the product');
      return;
    }

    setIsGeneratingDescription(true);
    
    try {
      console.log('Generating product description with AI:', aiDescriptionPrompt);
      
      const enhancedPrompt = `Write a compelling product description for e-commerce for: ${aiDescriptionPrompt}. The description should be professional, engaging, highlight key features and benefits, and encourage purchases. Keep it concise but informative, suitable for online store listings.`;
      
      const { data, error } = await supabase.functions.invoke('generate-design-image', {
        body: { 
          prompt: enhancedPrompt,
          style: 'text'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.generatedText || data?.imageUrl) {
        // For text generation, we might get the response in different formats
        const description = data.generatedText || data.description || 'Generated description';
        setFormData(prev => ({ ...prev, description }));
        toast.success('Product description generated successfully!');
        setAiDescriptionPrompt('');
      } else {
        throw new Error('No description generated');
      }
    } catch (error) {
      console.error('AI description generation error:', error);
      toast.error(`Failed to generate description: ${error.message}`);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      quantity_in_stock: '',
      image_url: '',
      tags: '',
      is_active: true
    });
  };

  const handleEdit = (item: StoreItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      quantity_in_stock: item.quantity_in_stock.toString(),
      image_url: item.image_url || '',
      tags: item.tags.join(', '),
      is_active: item.is_active
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canManageShop()) {
      toast.error('Access denied: You do not have permission to manage store items');
      return;
    }
    
    if (!formData.name || !formData.price || !formData.quantity_in_stock) {
      toast.error('Name, price, and quantity are required');
      return;
    }

    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, ...formData });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image_url: imageUrl }));
    setShowMediaPicker(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading store items...</div>;
  }

  // Show access denied message if user doesn't have permission
  if (!canManageShop()) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You need Treasurer, Merchandise Manager, or Admin permissions to manage store items.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Store Items</h3>
          <p className="text-muted-foreground">Manage your store inventory</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Store Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Product Description</Label>
                
                {/* AI Description Generation Section */}
                <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      <Label className="font-medium text-green-800">Generate Description with AI</Label>
                    </div>
                    <Textarea
                      placeholder="Describe your product briefly (e.g., 'blue hoodie with Spelman logo, soft cotton material, available in sizes S-XL')"
                      value={aiDescriptionPrompt}
                      onChange={(e) => setAiDescriptionPrompt(e.target.value)}
                      className="bg-white border-green-200"
                      rows={2}
                    />
                    <Button
                      type="button"
                      onClick={generateProductDescription}
                      disabled={isGeneratingDescription || !aiDescriptionPrompt.trim()}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isGeneratingDescription ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Description...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Product Description
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter item description or generate one with AI above"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity_in_stock">Quantity in Stock</Label>
                  <Input
                    id="quantity_in_stock"
                    type="number"
                    min="0"
                    value={formData.quantity_in_stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity_in_stock: e.target.value }))}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="hoodie, tour, merchandise"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Label>Product Image</Label>
                
                {/* AI Image Generation Section */}
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-blue-600" />
                      <Label className="font-medium text-blue-800">Generate with AI</Label>
                    </div>
                    <Textarea
                      placeholder="Describe your product (e.g., 'blue hoodie with Spelman logo', 'coffee mug with musical notes')"
                      value={aiImagePrompt}
                      onChange={(e) => setAiImagePrompt(e.target.value)}
                      className="bg-white border-blue-200"
                      rows={2}
                    />
                    <Button
                      type="button"
                      onClick={generateProductImage}
                      disabled={isGeneratingImage || !aiImagePrompt.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Image...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate Product Image
                        </>
                      )}
                    </Button>
                  </div>
                </Card>

                {/* Current Image Preview */}
                {formData.image_url && (
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.image_url}
                      alt="Product preview"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Current product image</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                )}

                {/* Alternative Options */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMediaPicker(true)}
                    className="flex-1"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Choose from Library
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createItemMutation.isPending}>
                  {createItemMutation.isPending ? 'Creating...' : 'Create Item'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Store Items ({storeItems?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {storeItems && storeItems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {storeItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatPrice(item.price)}</TableCell>
                    <TableCell>
                      <span className={item.quantity_in_stock === 0 ? 'text-red-500' : ''}>
                        {item.quantity_in_stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.is_active ? "default" : "secondary"}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteItemMutation.mutate(item.id)}
                          disabled={deleteItemMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No store items found. Create your first item to get started.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Store Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Product Description</Label>
              
              {/* AI Description Generation Section for Edit */}
              <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <Label className="font-medium text-green-800">Generate New Description with AI</Label>
                  </div>
                  <Textarea
                    placeholder="Describe your product briefly (e.g., 'blue hoodie with Spelman logo, soft cotton material, available in sizes S-XL')"
                    value={aiDescriptionPrompt}
                    onChange={(e) => setAiDescriptionPrompt(e.target.value)}
                    className="bg-white border-green-200"
                    rows={2}
                  />
                  <Button
                    type="button"
                    onClick={generateProductDescription}
                    disabled={isGeneratingDescription || !aiDescriptionPrompt.trim()}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isGeneratingDescription ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Description...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Product Description
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter item description or generate one with AI above"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-quantity_in_stock">Quantity in Stock</Label>
                <Input
                  id="edit-quantity_in_stock"
                  type="number"
                  min="0"
                  value={formData.quantity_in_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity_in_stock: e.target.value }))}
                  placeholder="0"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="hoodie, tour, merchandise"
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Product Image</Label>
              
              {/* AI Image Generation Section for Edit */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-blue-600" />
                    <Label className="font-medium text-blue-800">Generate New Image with AI</Label>
                  </div>
                  <Textarea
                    placeholder="Describe your product (e.g., 'blue hoodie with Spelman logo', 'coffee mug with musical notes')"
                    value={aiImagePrompt}
                    onChange={(e) => setAiImagePrompt(e.target.value)}
                    className="bg-white border-blue-200"
                    rows={2}
                  />
                  <Button
                    type="button"
                    onClick={generateProductImage}
                    disabled={isGeneratingImage || !aiImagePrompt.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Image...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Product Image
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Current Image Preview for Edit */}
              {formData.image_url && (
                <div className="flex items-center gap-4">
                  <img
                    src={formData.image_url}
                    alt="Product preview"
                    className="w-24 h-24 object-cover rounded border"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Current product image</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}

              {/* Alternative Options for Edit */}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMediaPicker(true)}
                  className="flex-1"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Choose from Library
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateItemMutation.isPending}>
                {updateItemMutation.isPending ? 'Updating...' : 'Update Item'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Media Picker */}
      {showMediaPicker && (
        <MediaPicker
          isOpen={showMediaPicker}
          onClose={() => setShowMediaPicker(false)}
          onSelect={handleImageSelect}
          currentImageUrl={formData.image_url}
          allowedTypes={['image']}
          showUpload={true}
        />
      )}
    </div>
  );
}
