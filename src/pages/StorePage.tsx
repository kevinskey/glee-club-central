
import React from 'react';
import { EnhancedStorefront } from '@/components/store/EnhancedStorefront';
import { CartProvider } from '@/contexts/CartContext';
import { UniversalHero } from '@/components/hero/UniversalHero';
import { Header } from '@/components/landing/Header';

export default function StorePage() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header />
        <UniversalHero 
          sectionId="store-hero"
          height="banner"
          showNavigation={false}
          enableAutoplay={false}
        />
        <div className="container mx-auto px-4 py-8">
          <EnhancedStorefront />
        </div>
      </div>
    </CartProvider>
  );
}
