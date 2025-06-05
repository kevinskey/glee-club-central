
import React from 'react';
import { EnhancedStorefront } from '@/components/store/EnhancedStorefront';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/landing/Header';

export default function StorePage() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <EnhancedStorefront />
        </div>
      </div>
    </CartProvider>
  );
}
