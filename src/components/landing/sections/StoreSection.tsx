
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Star, Tag } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

interface StoreSectionProps {
  products: Product[];
}

export function StoreSection({ products }: StoreSectionProps) {
  const featuredProducts = products.slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-background dark:via-muted/20 dark:to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-purple-200/50 dark:border-purple-800/50 mb-4">
            <ShoppingBag className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Official Merchandise</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Show Your Glee Spirit
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Support the Spelman College Glee Club with our exclusive merchandise collection
          </p>
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-white/90 dark:bg-card/90 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-purple-400" />
                      </div>
                    )}
                    
                    {/* Product Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                      {product.isSale && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Sale
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-purple-600">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">4.9</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Store Coming Soon</h3>
            <p className="text-muted-foreground">Stay tuned for our official merchandise!</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link to="/merchandise">
              Shop All Products
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
