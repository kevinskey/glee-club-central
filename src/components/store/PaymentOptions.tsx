
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Square } from 'lucide-react';
import { SquareCheckoutButton } from './SquareCheckoutButton';
import { useCart } from '@/contexts/CartContext';

interface PaymentOptionsProps {
  onStripeCheckout?: () => void;
}

export function PaymentOptions({ onStripeCheckout }: PaymentOptionsProps) {
  const [paymentMethod, setPaymentMethod] = useState('square');
  const { state } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="square" id="square" />
            <Label htmlFor="square" className="flex items-center gap-2 cursor-pointer">
              <Square className="h-4 w-4" />
              Square Payment
            </Label>
          </div>
          {onStripeCheckout && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stripe" id="stripe" />
              <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                <CreditCard className="h-4 w-4" />
                Stripe Payment
              </Label>
            </div>
          )}
        </RadioGroup>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center font-semibold text-lg mb-4">
            <span>Total</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>

          {paymentMethod === 'square' && (
            <SquareCheckoutButton className="w-full" />
          )}

          {paymentMethod === 'stripe' && onStripeCheckout && (
            <Button onClick={onStripeCheckout} className="w-full" size="lg">
              Checkout with Stripe
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
