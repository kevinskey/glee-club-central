
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/store/ProductCard';
import { CartDrawer } from '@/components/store/CartDrawer';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';
import { CartProvider } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  featured?: boolean;
  is_active: boolean;
}

function StoreContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('featured', { ascending: false })
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="GleeWorld Store"
        description="Show your Spelman Glee Club pride with official merchandise"
        actions={<CartDrawer />}
      />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
          <p className="text-muted-foreground">
            Check back soon for new merchandise!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function StorePage() {
  return (
    <CartProvider>
      <StoreContent />
    </CartProvider>
  );
}
