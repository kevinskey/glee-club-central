
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 glee-corners-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="glee-text-subhead text-green-700">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center glee-spacing-sm">
          <p className="glee-text-body">
            Thank you for your purchase! Your order has been confirmed and you will receive an email receipt shortly.
          </p>
          
          <div className="glee-spacing-xs">
            <Button asChild className="w-full">
              <Link to="/store">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
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
