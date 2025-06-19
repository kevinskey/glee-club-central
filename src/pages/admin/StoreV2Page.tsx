
import React, { useState } from 'react';
import { AdminV2Layout } from '@/layouts/AdminV2Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductManagement } from '@/components/admin/store/ProductManagement';
import { InventoryManager } from '@/components/admin/store/InventoryManager';
import { OrderManagement } from '@/components/admin/store/OrderManagement';
import { StoreAnalytics } from '@/components/admin/store/StoreAnalytics';
import { Badge } from '@/components/ui/badge';
import { Store, Package, ShoppingCart, BarChart3 } from 'lucide-react';

export default function StoreV2Page() {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <AdminV2Layout>
      <div className="glee-spacing-md">
        {/* Header */}
        <div className="glee-border-bottom pb-6">
          <h1 className="glee-text-display">
            Store & Merch Manager
          </h1>
          <p className="glee-text-body mt-2">
            Manage products, inventory, and orders
          </p>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
              <Store className="h-3 w-3 mr-1" />
              Store Active
            </Badge>
            <Badge variant="outline">
              23 Products
            </Badge>
            <Badge variant="outline">
              12 Pending Orders
            </Badge>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="glee-spacing-md">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <StoreAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </AdminV2Layout>
  );
}
