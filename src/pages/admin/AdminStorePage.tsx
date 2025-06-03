
import React from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Package, BarChart3, Settings, Lock, Palette } from 'lucide-react';
import { ProductManagement } from '@/components/admin/store/ProductManagement';
import { InventoryManager } from '@/components/admin/store/InventoryManager';
import { OrderManagement } from '@/components/admin/store/OrderManagement';
import { StoreAnalytics } from '@/components/admin/store/StoreAnalytics';
import { StoreSettings } from '@/components/admin/store/StoreSettings';
import { DesignStudio } from '@/components/design/DesignStudio';
import { AdminLayout } from '@/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminStorePage() {
  const { user, profile } = useAuth();

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

  if (!canManageShop()) {
    return (
      <AdminLayout>
        <div className="space-y-3">
          <PageHeader
            title="Store"
            icon={<Lock className="h-6 w-6" />}
            className="pb-4"
          />
          
          <Card>
            <CardContent className="p-6 text-center">
              <Lock className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-base font-semibold mb-2">Access Restricted</h3>
              <p className="text-sm text-muted-foreground">
                You need Treasurer, Merchandise Manager, or Admin permissions to access store management.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-3">
        <PageHeader
          title="Store"
          icon={<ShoppingBag className="h-6 w-6" />}
          className="pb-4"
        />

        <Tabs defaultValue="inventory" className="space-y-3">
          <TabsList className="grid w-full grid-cols-6 h-8">
            <TabsTrigger value="inventory" className="flex items-center gap-1 text-xs px-2">
              <Package className="h-3 w-3" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1 text-xs px-2">
              <Package className="h-3 w-3" />
              Products
            </TabsTrigger>
            <TabsTrigger value="designer" className="flex items-center gap-1 text-xs px-2">
              <Palette className="h-3 w-3" />
              Designer
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-1 text-xs px-2">
              <ShoppingBag className="h-3 w-3" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs px-2">
              <BarChart3 className="h-3 w-3" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-xs px-2">
              <Settings className="h-3 w-3" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="mt-2">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="products" className="mt-2">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="designer" className="mt-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <DesignStudio />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-2">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-2">
            <StoreAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="mt-2">
            <StoreSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
