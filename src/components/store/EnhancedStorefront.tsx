
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProductCard } from '@/components/store/ProductCard';
import { ProductFilter } from '@/components/store/ProductFilter';
import { ProductDetails } from '@/components/store/ProductDetails';
import { CartDrawer } from '@/components/store/CartDrawer';
import { PageHeader } from '@/components/ui/page-header';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

type SortOption = 'name' | 'price-low' | 'price-high' | 'newest' | 'stock';

export function EnhancedStorefront() {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<StoreItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  useEffect(() => {
    fetchStoreItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [storeItems, searchTerm, selectedTags, priceRange, inStockOnly, sortBy]);

  const fetchStoreItems = async () => {
    try {
      const { data, error } = await supabase
        .from('store_items')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setStoreItems(data || []);
    } catch (error) {
      console.error('Error fetching store items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...storeItems];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }

    // Price range filter
    filtered = filtered.filter(item =>
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(item => item.quantity_in_stock > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return 0; // Would need created_at field
        case 'stock':
          return b.quantity_in_stock - a.quantity_in_stock;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredItems(filtered);
  };

  const getAllTags = () => {
    const allTags = new Set<string>();
    storeItems.forEach(item => {
      item.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  };

  const handleProductClick = (product: StoreItem) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTags={selectedTags}
            onTagChange={setSelectedTags}
            availableTags={getAllTags()}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
          />
        </div>

        {/* Products Area */}
        <div className="lg:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-muted-foreground">
              {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found
            </p>
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="stock">Stock Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} onClick={() => handleProductClick(item)} className="cursor-pointer">
                  <ProductCard 
                    product={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image_url: item.image_url,
                      featured: false,
                      is_active: item.is_active
                    }} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
}
