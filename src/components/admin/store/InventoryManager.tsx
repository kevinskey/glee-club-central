
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Package, Plus, Minus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { LowStockAlertTrigger } from './LowStockAlertTrigger';

interface StoreItem {
  id: string;
  name: string;
  price: number;
  quantity_in_stock: number;
  tags: string[];
  is_active: boolean;
  image_url?: string;
}

export function InventoryManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['store-inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_items')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as StoreItem[];
    },
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async ({ id, newQuantity, reason }: { id: string; newQuantity: number; reason: string }) => {
      const { error } = await supabase
        .from('store_items')
        .update({ quantity_in_stock: newQuantity })
        .eq('id', id);

      if (error) throw error;

      // Log inventory change (you could create an inventory_logs table for this)
      console.log(`Inventory updated for item ${id}: ${newQuantity} (${reason})`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-inventory'] });
      toast.success('Inventory updated successfully');
      setSelectedItem(null);
      setAdjustmentAmount('');
      setAdjustmentReason('');
    },
    onError: (error) => {
      toast.error('Failed to update inventory');
      console.error(error);
    }
  });

  const filteredItems = items?.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = !showLowStockOnly || item.quantity_in_stock <= 10;
    return matchesSearch && matchesFilter;
  });

  const lowStockItems = items?.filter(item => item.quantity_in_stock <= 10) || [];

  const handleAdjustment = (type: 'add' | 'subtract' | 'set') => {
    if (!selectedItem || !adjustmentAmount) return;

    const amount = parseInt(adjustmentAmount);
    let newQuantity = selectedItem.quantity_in_stock;

    switch (type) {
      case 'add':
        newQuantity += amount;
        break;
      case 'subtract':
        newQuantity = Math.max(0, newQuantity - amount);
        break;
      case 'set':
        newQuantity = Math.max(0, amount);
        break;
    }

    updateInventoryMutation.mutate({
      id: selectedItem.id,
      newQuantity,
      reason: adjustmentReason || `${type} ${amount}`
    });
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-500' };
    if (quantity <= 5) return { label: 'Critical', color: 'bg-red-400' };
    if (quantity <= 10) return { label: 'Low Stock', color: 'bg-yellow-500' };
    return { label: 'In Stock', color: 'bg-green-500' };
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
                <p className="text-2xl font-bold">{items?.length || 0}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {items?.filter(item => item.quantity_in_stock === 0).length || 0}
                </p>
              </div>
              <Package className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold">
                  ${items?.reduce((sum, item) => sum + (item.price * item.quantity_in_stock), 0).toFixed(2) || '0.00'}
                </p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <LowStockAlertTrigger items={lowStockItems} />
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Inventory Management</span>
            <div className="flex gap-2">
              <Button
                variant={showLowStockOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Low Stock Only
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems?.map((item) => {
                const status = getStockStatus(item.quantity_in_stock);
                return (
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
                          <div className="flex gap-1 mt-1">
                            {item.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${item.quantity_in_stock <= 10 ? 'text-red-500' : ''}`}>
                        {item.quantity_in_stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} text-white`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${(item.price * item.quantity_in_stock).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            Adjust Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Adjust Inventory - {selectedItem?.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Current Stock: {selectedItem?.quantity_in_stock}</Label>
                            </div>
                            <div>
                              <Label htmlFor="amount">Adjustment Amount</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={adjustmentAmount}
                                onChange={(e) => setAdjustmentAmount(e.target.value)}
                                placeholder="Enter amount"
                              />
                            </div>
                            <div>
                              <Label htmlFor="reason">Reason (Optional)</Label>
                              <Input
                                id="reason"
                                value={adjustmentReason}
                                onChange={(e) => setAdjustmentReason(e.target.value)}
                                placeholder="e.g., 'Restock', 'Damaged items', 'Sale'"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                onClick={() => handleAdjustment('add')}
                                disabled={!adjustmentAmount || updateInventoryMutation.isPending}
                                className="flex-1"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Stock
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleAdjustment('subtract')}
                                disabled={!adjustmentAmount || updateInventoryMutation.isPending}
                                className="flex-1"
                              >
                                <Minus className="h-4 w-4 mr-2" />
                                Remove Stock
                              </Button>
                              <Button
                                onClick={() => handleAdjustment('set')}
                                disabled={!adjustmentAmount || updateInventoryMutation.isPending}
                                className="flex-1"
                              >
                                Set to {adjustmentAmount}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
