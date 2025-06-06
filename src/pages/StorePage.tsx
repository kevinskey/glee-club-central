
import React from 'react';
import { EnhancedStorefront } from '@/components/store/EnhancedStorefront';
import { CartProvider } from '@/contexts/CartContext';
import { PublicPageWrapper } from '@/components/landing/PublicPageWrapper';

export default function StorePage() {
  return (
    <CartProvider>
      <PublicPageWrapper>
        <div className="container mx-auto px-4 py-8">
          <EnhancedStorefront />
        </div>
      </PublicPageWrapper>
    </CartProvider>
  );
}
