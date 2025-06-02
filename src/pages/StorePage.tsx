
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/store/ProductCard';
import { CartDrawer } from '@/components/store/CartDrawer';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';
import { CartProvider } from '@/contexts/CartContext';

interface StoreItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity_in_stock: number;
  image_url?: string;
  tags: string[];
  is_active: boolean;
}

function StoreContent() {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const { data, error } = await supabase
        .from('store_items')
        .select('*')
        .eq('is_active', true)
        .gt('quantity_in_stock', 0) // Only show items in stock
        .order('name');

      if (error) throw error;
      setStoreItems(data || []);
    } catch (error) {
      console.error('Error fetching store items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading store items...</p>
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

      {storeItems.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No Items Available</h3>
          <p className="text-muted-foreground">
            Check back soon for new merchandise!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {storeItems.map((item) => (
            <ProductCard 
              key={item.id} 
              product={{
                id: item.id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                featured: false, // We can add this logic later if needed
                is_active: item.is_active
              }} 
            />
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
