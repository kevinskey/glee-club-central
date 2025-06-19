
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, Package } from 'lucide-react';
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
          <p className="glee-text-body mb-4">
            Contact an administrator to enable access to the store features.
          </p>
          <Badge variant="secondary">Access Disabled</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="glee-spacing-md">
      <div className="flex items-center justify-between">
        <h2 className="glee-text-headline">E-commerce Hub</h2>
        <Badge variant="default" className="bg-green-100 text-green-800">
          Access Enabled
        </Badge>
      </div>

      <div className="glee-grid-3">
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
            <p className="glee-text-body mb-4">
              Shop for official Glee Club merchandise and more.
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
            <p className="glee-text-body mb-4">
              Use your credits for purchases.
            </p>
            <Button variant="outline" className="w-full">
              View Transaction History
            </Button>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Order History
            </CardTitle>
            <CardDescription>
              Your purchase history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              0
            </div>
            <p className="glee-text-body mb-4">
              View your past orders and track shipments.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/store')}
            >
              View Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
