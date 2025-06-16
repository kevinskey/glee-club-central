
import React from 'react';
import { EnhancedStorefront } from '@/components/store/EnhancedStorefront';
import { CartProvider } from '@/contexts/CartContext';

export default function StorePage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <EnhancedStorefront />
        </div>
      </div>
    </CartProvider>
  );
}
