
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface StorePreviewProps {
  products?: any[]; // Keep for backwards compatibility
  title?: string;
  subtitle?: string;
  showShopAllButton?: boolean;
  onShopAll?: () => void;
}

export function StorePreview({ 
  title = "Featured Products", 
  subtitle = "Check out our latest merchandise",
  showShopAllButton = true,
  onShopAll
}: StorePreviewProps) {
  const [featuredItems, setFeaturedItems] = useState<StoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const { data, error } = await supabase
        .from('store_items')
        .select('*')
        .eq('is_active', true)
        .gt('quantity_in_stock', 0)
        .order('created_at', { ascending: false })
        .limit(4); // Show 4 featured items

      if (error) throw error;
      setFeaturedItems(data || []);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="glee-container">
        <div className="text-center mb-8">
          <h2 className="glee-text-headline">{title}</h2>
          <p className="glee-text-body">{subtitle}</p>
        </div>
        <div className="glee-grid-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-black border-gray-700">
              <CardHeader>
                <div className="w-full h-48 bg-gray-200 glee-corners"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 glee-corners mb-2"></div>
                <div className="h-4 bg-gray-200 glee-corners w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (featuredItems.length === 0) {
    return (
      <div className="glee-container text-center glee-section">
        <h2 className="glee-text-headline">{title}</h2>
        <p className="glee-text-body mb-8">{subtitle}</p>
        <p className="glee-text-body">No items available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="glee-container">
      <div className="text-center mb-8">
        <h2 className="glee-text-headline">{title}</h2>
        <p className="glee-text-body">{subtitle}</p>
      </div>

      <div className="glee-grid-4 mb-8">
        {featuredItems.map((item) => (
          <Card key={item.id} className="group hover:shadow-lg transition-shadow bg-black border-gray-700">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden glee-corners-lg">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 glee-image-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-glee-purple/20 to-glee-orange/20 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-glee-purple/50" />
                  </div>
                )}
                {item.tags.includes('new') && (
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    New
                  </Badge>
                )}
                {item.tags.includes('featured') && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <h3 className="glee-text-subhead line-clamp-1 text-white">{item.name}</h3>
              {item.description && (
                <p className="glee-text-caption line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-glee-purple">
                  {formatPrice(item.price)}
                </span>
                <span className="glee-text-caption">
                  {item.quantity_in_stock} in stock
                </span>
              </div>
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full bg-glee-purple hover:bg-glee-purple/90">
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showShopAllButton && (
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-glee-orange hover:bg-glee-orange/90"
            onClick={onShopAll || (() => window.location.href = '/store')}
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Shop All Items
          </Button>
        </div>
      )}
    </div>
  );
}
