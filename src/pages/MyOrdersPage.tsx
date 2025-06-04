
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { UserOrdersTable } from '@/components/orders/UserOrdersTable';
import { ResponsiveText } from '@/components/ui/responsive-text';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

interface UserOrder {
  id: string;
  user_id: string;
  item_ids: string[];
  total_price: number;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  shipping_address?: string;
  created_at: string;
}

export default function MyOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<UserOrder | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center gap-3 mb-8">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <ResponsiveText 
              as="h1" 
              size="4xl" 
              className="font-playfair font-bold text-foreground"
            >
              My Orders
            </ResponsiveText>
          </div>

          <ResponsiveText 
            size="lg" 
            className="text-muted-foreground leading-relaxed mb-8"
          >
            View and track your order history from the Spelman College Glee Club store.
          </ResponsiveText>

          {/* Orders Table */}
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <UserOrdersTable onViewDetails={setSelectedOrder} />
            </CardContent>
          </Card>

          {/* TODO: Add order details modal/drawer when selectedOrder is set */}
        </div>
      </div>
    </div>
  );
}
