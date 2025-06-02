
import React from 'react';
import { EnhancedStorefront } from '@/components/store/EnhancedStorefront';
import { CartProvider } from '@/contexts/CartContext';

export default function StorePage() {
  return (
    <CartProvider>
      <EnhancedStorefront />
    </CartProvider>
  );
}
