
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SquareCheckoutButtonProps {
  className?: string;
}

export function SquareCheckoutButton({ className }: SquareCheckoutButtonProps) {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSquareCheckout = async () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare items for Square checkout
      const items = state.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      console.log('Creating Square checkout with items:', items);

      // Call Square checkout edge function
      const { data, error } = await supabase.functions.invoke('create_square_checkout', {
        body: {
          items,
          buyer_email: user?.email,
        },
      });

      if (error) {
        console.error('Square checkout error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (!data?.url) {
        throw new Error('No checkout URL received from Square');
      }

      console.log('Square checkout created successfully:', data);

      // Open Square checkout in a new tab
      window.open(data.url, '_blank');

      // Optional: Clear cart after successful checkout creation
      // clearCart();
      
      toast.success('Redirecting to Square checkout...');

    } catch (error) {
      console.error('Square checkout failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSquareCheckout}
      disabled={isLoading || state.items.length === 0}
      className={className}
      size="lg"
    >
      {isLoading ? 'Creating Checkout...' : 'Checkout with Square'}
    </Button>
  );
}
