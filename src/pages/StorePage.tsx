
import React from 'react';
import { EnhancedStorefront } from '@/components/store/EnhancedStorefront';
import { CartProvider } from '@/contexts/CartContext';

export default function StorePage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <div className="glee-container glee-section">
          <EnhancedStorefront />
        </div>
      </div>
    </CartProvider>
  );
}
