import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function CartDrawer() {
  const { state, updateQuantity, removeItem, clearCart, toggleCart, getTotalItems, getTotalPrice } = useCart();

  const handleCheckout = async () => {
    if (state.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      console.log('🛒 Starting checkout process with items:', state.items);

      // Format items for the checkout session
      const checkoutItems = state.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      // Call the new create_checkout_session edge function
      const { data, error } = await supabase.functions.invoke('create_checkout_session', {
        body: {
          items: checkoutItems,
          buyer_email: undefined // Optional: could collect email from user
        }
      });

      if (error) {
        console.error('Checkout error:', error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('No checkout URL received');
      }

      console.log('✅ Checkout session created, redirecting to:', data.url);

      // Redirect to Stripe checkout
      window.open(data.url, '_blank');
      
      // Optionally close the cart drawer
      toggleCart();

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to start checkout process. Please try again.');
    }
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 py-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center font-medium">
                  <span>Total: ${getTotalPrice().toFixed(2)}</span>
                  <span>{getTotalItems()} items</span>
                </div>
                
                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full">
                    Checkout
                  </Button>
                  <Button variant="outline" onClick={clearCart} className="w-full">
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
