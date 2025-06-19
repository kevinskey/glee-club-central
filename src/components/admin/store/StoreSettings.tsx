
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Store, CreditCard, Truck } from 'lucide-react';

export function StoreSettings() {
  return (
    <div className="glee-spacing-md">
      <div className="glee-grid-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="glee-spacing-sm">
            <div className="glee-spacing-xs">
              <Label htmlFor="store-name">Store Name</Label>
              <Input id="store-name" placeholder="Spelman Glee Club Store" />
            </div>
            <div className="glee-spacing-xs">
              <Label htmlFor="store-description">Store Description</Label>
              <Textarea 
                id="store-description" 
                placeholder="Official merchandise for the Spelman College Glee Club"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="store-enabled">Store Enabled</Label>
              <Switch id="store-enabled" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="guest-checkout">Allow Guest Checkout</Label>
              <Switch id="guest-checkout" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="glee-spacing-sm">
            <div className="glee-spacing-xs">
              <Label htmlFor="currency">Default Currency</Label>
              <Input id="currency" value="USD" disabled />
            </div>
            <div className="glee-spacing-xs">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" placeholder="8.25" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="stripe-enabled">Stripe Payments</Label>
              <Switch id="stripe-enabled" defaultChecked />
            </div>
            <div className="glee-spacing-xs">
              <Label htmlFor="stripe-key">Stripe Public Key</Label>
              <Input id="stripe-key" placeholder="pk_..." type="password" />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="glee-spacing-sm">
            <div className="glee-spacing-xs">
              <Label htmlFor="shipping-cost">Default Shipping Cost</Label>
              <Input id="shipping-cost" type="number" placeholder="5.99" />
            </div>
            <div className="glee-spacing-xs">
              <Label htmlFor="free-shipping">Free Shipping Threshold</Label>
              <Input id="free-shipping" type="number" placeholder="50.00" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="local-pickup">Allow Local Pickup</Label>
              <Switch id="local-pickup" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="glee-spacing-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor="order-notifications">Order Notifications</Label>
              <Switch id="order-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
              <Switch id="low-stock-alerts" defaultChecked />
            </div>
            <div className="glee-spacing-xs">
              <Label htmlFor="notification-email">Notification Email</Label>
              <Input id="notification-email" type="email" placeholder="admin@spelman.edu" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
