
import React, { useState } from 'react';
import { PageWrapper } from '@/components/ui/page-wrapper';
import { UserOrdersTable } from '@/components/orders/UserOrdersTable';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { UserOrderDetailsDialog } from '@/components/orders/UserOrderDetailsDialog';

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
    <PageWrapper
      title="My Orders"
      description="View and track your order history from the Spelman College Glee Club store."
      icon={<ShoppingBag />}
      maxWidth="xl"
    >
      {/* Orders Table */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <UserOrdersTable onViewDetails={setSelectedOrder} />
        </CardContent>
      </Card>

      {selectedOrder && (
        <UserOrderDetailsDialog
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </PageWrapper>
  );
}
