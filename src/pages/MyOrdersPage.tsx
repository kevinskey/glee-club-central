
import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { UserOrdersTable } from '@/components/orders/UserOrdersTable';
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
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description="View and track your order history"
        icon={<ShoppingBag className="h-6 w-6" />}
      />

      <UserOrdersTable onViewDetails={setSelectedOrder} />

      {/* TODO: Add order details modal/drawer when selectedOrder is set */}
    </div>
  );
}
