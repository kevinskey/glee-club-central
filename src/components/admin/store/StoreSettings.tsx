
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export function StoreSettings() {
  const [settings, setSettings] = useState({
    storeName: 'GleeWorld Store',
    storeDescription: 'Show your Spelman Glee Club pride with official merchandise',
    enableStore: true,
    enableShipping: true,
    shippingCost: '5.99',
    freeShippingThreshold: '50.00',
    taxRate: '8.5',
    storePolicies: 'All sales are final. Please allow 2-3 weeks for shipping.',
    contactEmail: 'store@gleeworld.org',
    enableInventoryTracking: false
  });

  const handleSave = () => {
    // In a real implementation, this would save to the database
    toast.success('Store settings saved successfully');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Store Settings</h3>
        <p className="text-muted-foreground">Configure your store preferences and policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange('storeName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enableStore"
                checked={settings.enableStore}
                onCheckedChange={(checked) => handleInputChange('enableStore', checked)}
              />
              <Label htmlFor="enableStore">Enable Store</Label>
            </div>
          </CardContent>
        </Card>

        {/* Shipping & Tax Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping & Tax</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableShipping"
                checked={settings.enableShipping}
                onCheckedChange={(checked) => handleInputChange('enableShipping', checked)}
              />
              <Label htmlFor="enableShipping">Enable Shipping</Label>
            </div>
            <div>
              <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
              <Input
                id="shippingCost"
                type="number"
                step="0.01"
                value={settings.shippingCost}
                onChange={(e) => handleInputChange('shippingCost', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleInputChange('freeShippingThreshold', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => handleInputChange('taxRate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableInventoryTracking"
                checked={settings.enableInventoryTracking}
                onCheckedChange={(checked) => handleInputChange('enableInventoryTracking', checked)}
              />
              <Label htmlFor="enableInventoryTracking">Enable Inventory Tracking</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              When enabled, product quantities will be tracked and automatically updated when orders are placed.
            </p>
          </CardContent>
        </Card>

        {/* Store Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Store Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storePolicies">Return & Shipping Policy</Label>
              <Textarea
                id="storePolicies"
                value={settings.storePolicies}
                onChange={(e) => handleInputChange('storePolicies', e.target.value)}
                rows={4}
                placeholder="Enter your store policies..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}
