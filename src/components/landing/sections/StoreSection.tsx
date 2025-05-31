
import React from "react";
import { StorePreview } from "@/components/landing/StorePreview";

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
  return (
    <section className="py-12 md:py-16">
      <StorePreview 
        products={products}
        title="Glee Club Store"
        subtitle="Show your Spelman Glee Club pride"
        showShopAllButton={true}
        onShopAll={() => window.location.href = "/store"}
      />
    </section>
  );
}
