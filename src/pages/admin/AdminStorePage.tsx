
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Package, BarChart3, Settings } from 'lucide-react';
import { ProductManagement } from '@/components/admin/store/ProductManagement';
import { InventoryManager } from '@/components/admin/store/InventoryManager';
import { OrderManagement } from '@/components/admin/store/OrderManagement';
import { StoreAnalytics } from '@/components/admin/store/StoreAnalytics';
import { StoreSettings } from '@/components/admin/store/StoreSettings';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';

export default function AdminStorePage() {
  const { user, profile } = useAuth();

  // Check if user has permission to manage shop
  const canManageShop = () => {
    if (!user || !profile) return false;
    
    const currentUser = {
      ...user,
      role_tags: profile?.role_tags || []
    };
    
    return hasPermission(currentUser, 'manage_shop') || 
           profile?.role_tags?.includes('Treasurer') ||
           profile?.role_tags?.includes('Merchandise Manager') ||
           profile?.is_super_admin;
  };

  if (!canManageShop()) {
    return (
      <div className="glee-container glee-section">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="glee-text-subhead mb-2">Access Restricted</h3>
            <p className="glee-text-body">
              You need Treasurer, Merchandise Manager, or Admin permissions to access store management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="glee-container glee-section">
      <div className="glee-spacing-md">
        {/* Header */}
        <div className="glee-border-bottom pb-6">
          <h1 className="glee-text-display">
            Store Management
          </h1>
          <p className="glee-text-body mt-2">
            Manage products, inventory, orders, and store settings
          </p>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="glee-spacing-md">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
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

          <TabsContent value="settings">
            <StoreSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
