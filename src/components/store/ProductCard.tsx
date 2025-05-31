
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-glee-spelman">
              Featured
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
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
