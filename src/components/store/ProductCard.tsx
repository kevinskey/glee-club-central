
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  featured?: boolean;
  is_active?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="glee-card-base overflow-hidden hover:shadow-lg transition-shadow bg-black border-gray-700">
      <CardContent className="p-0">
        <div className="relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 glee-image-cover"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="glee-text-caption">No Image</span>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-glee-spelman">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="glee-text-subhead text-white">{product.name}</h3>
          <p className="text-2xl font-bold text-glee-purple">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
