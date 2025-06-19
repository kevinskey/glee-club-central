
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';
import { 
  Calculator, 
  Package, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Shirt,
  Printer,
  BarChart3,
  Lock
} from 'lucide-react';
import { AttendanceInventoryCalculator } from '@/components/merch/AttendanceInventoryCalculator';
import { DTFCostCalculator } from '@/components/merch/DTFCostCalculator';
import { BlankSourcingCalculator } from '@/components/merch/BlankSourcingCalculator';
import { ProfitMarginCalculator } from '@/components/merch/ProfitMarginCalculator';
import { ProductionTimelinePlanner } from '@/components/merch/ProductionTimelinePlanner';
import { InventoryManager } from '@/components/admin/store/InventoryManager';

export default function MerchandiseCalculatorPage() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('calculations');

  // Check if user has permission to access merch management
  const canAccessMerch = () => {
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

  if (!canAccessMerch()) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              You need Treasurer, Merchandise Manager, or Admin permissions to access merchandise management tools.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="h-8 w-8 text-orange-500" />
          <h1 className="text-3xl font-bold text-[#003366] dark:text-white">Merchandise Management</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Concert merchandise planning, calculations, and inventory management
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
            <Package className="h-3 w-3 mr-1" />
            Operations Dashboard
          </Badge>
          <Badge variant="outline">
            {profile?.role_tags?.includes('Merchandise Manager') ? 'Merchandise Manager' : 
             profile?.role_tags?.includes('Treasurer') ? 'Treasurer' : 'Administrator'}
          </Badge>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculations" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculators
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Production
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculations" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <AttendanceInventoryCalculator />
            <ProfitMarginCalculator />
            <DTFCostCalculator />
            <BlankSourcingCalculator />
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManager />
        </TabsContent>

        <TabsContent value="production">
          <ProductionTimelinePlanner />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Merchandise Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics dashboard coming soon. Track sales performance, popular items, and revenue trends.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
