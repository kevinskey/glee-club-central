
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ShoppingBag, Home } from 'lucide-react';

export default function CheckoutCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            Checkout Cancelled
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your checkout was cancelled. No payment was processed. Your items are still in your cart.
          </p>
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/store">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Return to Store
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
