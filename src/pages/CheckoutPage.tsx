
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { CheckoutForm } from '@/components/store/CheckoutForm';
import { CartProvider } from '@/contexts/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function CheckoutContent() {
  const [orderComplete, setOrderComplete] = useState(false);
  const navigate = useNavigate();

  if (orderComplete) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Order Confirmation"
          description="Thank you for your purchase!"
        />
        
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h3>
            <p className="text-muted-foreground mb-6">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/store')}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/my-orders')}>
                View My Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Checkout"
        description="Complete your purchase"
      />
      
      <CheckoutForm onSuccess={() => setOrderComplete(true)} />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <CheckoutContent />
    </CartProvider>
  );
}
