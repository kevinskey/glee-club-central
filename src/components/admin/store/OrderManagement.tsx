
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTable } from '@/components/orders/OrderTable';
import { OrderFilterPanel } from '@/components/orders/OrderFilterPanel';
import { ExportOrdersButton } from '@/components/orders/ExportOrdersButton';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';

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

export function OrderManagement() {
  const [searchEmail, setSearchEmail] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['store-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      const emailMatch = searchEmail === '' || 
        order.customer_email.toLowerCase().includes(searchEmail.toLowerCase());
      const statusMatch = statusFilter === 'all' || order.status === statusFilter;
      
      return emailMatch && statusMatch;
    });
  }, [orders, searchEmail, statusFilter]);

  const totalRevenue = useMemo(() => {
    if (!orders) return 0;
    return orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + order.amount, 0) / 100; // Convert cents to dollars
  }, [orders]);

  const orderStats = useMemo(() => {
    if (!orders) return { total: 0, completed: 0, pending: 0, failed: 0 };
    
    return orders.reduce((stats, order) => {
      stats.total++;
      if (order.status === 'completed') stats.completed++;
      else if (order.status === 'pending') stats.pending++;
      else if (order.status === 'failed') stats.failed++;
      return stats;
    }, { total: 0, completed: 0, pending: 0, failed: 0 });
  }, [orders]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Error loading orders: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totalRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Order Management</h3>
        <ExportOrdersButton orders={filteredOrders} />
      </div>

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
