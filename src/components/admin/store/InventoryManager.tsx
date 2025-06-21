import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, AlertTriangle, Plus, Minus } from "lucide-react";
import { toast } from "sonner";

interface StoreItem {
  id: string;
  name: string;
  price: number;
  quantity_in_stock: number;
  is_active: boolean;
  tags: string[];
}

export function InventoryManager() {
  const [adjustments, setAdjustments] = useState<{ [key: string]: number }>({});
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery({
    queryKey: ["store-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("store_items")
        .select("id, name, price, quantity_in_stock, is_active, tags")
        .order("name");

      if (error) throw error;
      return data as StoreItem[];
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({
      productId,
      newQuantity,
    }: {
      productId: string;
      newQuantity: number;
    }) => {
      const { error } = await supabase
        .from("store_items")
        .update({ quantity_in_stock: Math.max(0, newQuantity) })
        .eq("id", productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store-inventory"] });
      toast.success("Stock updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update stock");
      console.error(error);
    },
  });

  const handleStockAdjustment = (
    productId: string,
    currentStock: number,
    adjustment: number,
  ) => {
    const newQuantity = currentStock + adjustment;
    updateStockMutation.mutate({ productId, newQuantity });
  };

  const handleDirectStockUpdate = (productId: string, newQuantity: number) => {
    updateStockMutation.mutate({ productId, newQuantity });
  };

  const lowStockItems =
    products?.filter((product) => product.quantity_in_stock < 10) || [];
  const outOfStockItems =
    products?.filter((product) => product.quantity_in_stock === 0) || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading inventory...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {lowStockItems.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {outOfStockItems.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Current Stock</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => {
                  const isLowStock = product.quantity_in_stock < 10;
                  const isOutOfStock = product.quantity_in_stock === 0;

                  return (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.tags && product.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {product.tags.slice(0, 2).map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="font-medium">${product.price}</span>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={product.quantity_in_stock}
                            onChange={(e) =>
                              handleDirectStockUpdate(
                                product.id,
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="w-20"
                            min="0"
                          />
                          {isOutOfStock && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {isLowStock && !isOutOfStock && (
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge
                          variant={
                            isOutOfStock
                              ? "destructive"
                              : isLowStock
                                ? "secondary"
                                : "default"
                          }
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : isLowStock
                              ? "Low Stock"
                              : "In Stock"}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStockAdjustment(
                                product.id,
                                product.quantity_in_stock,
                                -1,
                              )
                            }
                            disabled={product.quantity_in_stock === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStockAdjustment(
                                product.id,
                                product.quantity_in_stock,
                                1,
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStockAdjustment(
                                product.id,
                                product.quantity_in_stock,
                                10,
                              )
                            }
                          >
                            +10
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {products?.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">
                Add some products to manage inventory
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
