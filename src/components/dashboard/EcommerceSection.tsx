
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Palette, CreditCard, Package } from 'lucide-react';
import { Profile } from '@/types/auth';

interface EcommerceSectionProps {
  profile: Profile;
}

export function EcommerceSection({ profile }: EcommerceSectionProps) {
  const navigate = useNavigate();

  if (!profile.ecommerce_enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            E-commerce Features
          </CardTitle>
          <CardDescription>
            E-commerce access is currently disabled for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Contact an administrator to enable access to the design studio and store features.
          </p>
          <Badge variant="secondary">Access Disabled</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">E-commerce Hub</h2>
        <Badge variant="default" className="bg-green-100 text-green-800">
          Access Enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Design Studio */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/design-studio')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-600" />
              Design Studio
            </CardTitle>
            <CardDescription>
              Create custom designs for merchandise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Design your own custom t-shirts and merchandise with our intuitive design tools.
            </p>
            <Button className="w-full">
              Open Design Studio
            </Button>
          </CardContent>
        </Card>

        {/* Store */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/store')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
              Glee Club Store
            </CardTitle>
            <CardDescription>
              Browse and purchase merchandise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Shop for official Glee Club merchandise, custom designs, and more.
            </p>
            <Button className="w-full">
              Browse Store
            </Button>
          </CardContent>
        </Card>

        {/* Account Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-green-600" />
              Account Balance
            </CardTitle>
            <CardDescription>
              Your available store credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 mb-2">
              ${(profile.account_balance || 0).toFixed(2)}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Use your credits for purchases and custom designs.
            </p>
            <Button variant="outline" className="w-full">
              View Transaction History
            </Button>
          </CardContent>
        </Card>

        {/* Design History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Saved Designs
            </CardTitle>
            <CardDescription>
              Your design collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {profile.design_history_ids?.length || 0}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {profile.design_history_ids?.length ? 
                'View and manage your saved designs.' : 
                'Start creating designs to build your collection.'
              }
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/design-studio')}
            >
              {profile.design_history_ids?.length ? 'View Designs' : 'Create First Design'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
