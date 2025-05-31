
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

interface StorePreviewProps {
  products: Product[];
  title?: string;
  subtitle?: string;
  showShopAllButton?: boolean;
  onShopAll?: () => void;
  className?: string;
}

export function StorePreview({
  products = [],
  title = "Glee Club Store",
  subtitle = "Show your Spelman Glee Club pride",
  showShopAllButton = true,
  onShopAll,
  className = ""
}: StorePreviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Mock products if none provided
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Glee Club T-Shirt",
      price: 25.00,
      imageUrl: "/placeholder.svg",
      isNew: true
    },
    {
      id: "2",
      name: "Concert Program",
      price: 15.00,
      imageUrl: "/placeholder.svg"
    },
    {
      id: "3",
      name: "Glee Club Hoodie",
      price: 45.00,
      imageUrl: "/placeholder.svg",
      isSale: true,
      originalPrice: 55.00
    },
    {
      id: "4",
      name: "Alumni Pin",
      price: 12.00,
      imageUrl: "/placeholder.svg"
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-playfair font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {displayProducts.slice(0, 4).map((product) => (
            <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge variant="secondary" className="bg-glee-spelman text-white">
                        New
                      </Badge>
                    )}
                    {product.isSale && (
                      <Badge variant="destructive">
                        Sale
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-medium text-sm md:text-base line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-glee-spelman">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Shop All Button */}
        {showShopAllButton && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={onShopAll}
              className="border-glee-spelman text-glee-spelman hover:bg-glee-spelman hover:text-white"
            >
              Shop All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
