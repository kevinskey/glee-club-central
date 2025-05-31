
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageHeader } from '@/components/ui/page-header';
import { ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { OrderFilterPanel } from '@/components/orders/OrderFilterPanel';
import { OrderTable } from '@/components/orders/OrderTable';
import { ExportOrdersButton } from '@/components/orders/ExportOrdersButton';

interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name?: string;
  amount: number;
  currency: string;
  status: string;
  items: any[];
  shipping_address?: any;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders from Supabase
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      console.log('Fetching orders from Supabase...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched:', data);
      return data as Order[];
    },
  });

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const emailMatch = searchEmail === '' || 
        order.customer_email.toLowerCase().includes(searchEmail.toLowerCase());
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      return emailMatch && statusMatch;
    });
  }, [orders, searchEmail, statusFilter]);

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Order Management"
          description="Manage and track customer orders"
          icon={<ShoppingBag className="h-6 w-6" />}
        />
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading orders: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Management"
        description="Manage and track customer orders"
        icon={<ShoppingBag className="h-6 w-6" />}
        actions={<ExportOrdersButton orders={filteredOrders} />}
      />

      <OrderFilterPanel
        searchEmail={searchEmail}
        setSearchEmail={setSearchEmail}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        onViewDetails={setSelectedOrder}
      />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
