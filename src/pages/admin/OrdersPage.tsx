
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { OrderDetailsModal } from '@/components/admin/OrderDetailsModal';
import { format } from 'date-fns';

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

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100); // Convert from cents
  };

  // Format order ID (last 6 chars)
  const formatOrderId = (id: string, stripeSessionId?: string) => {
    if (stripeSessionId) {
      return stripeSessionId.slice(-8);
    }
    return id.slice(-6);
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'complete':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Render items
  const renderItems = (items: any[]) => {
    if (!items || items.length === 0) return 'No items';
    
    return items.map((item, index) => (
      <div key={index} className="text-sm">
        {item.product_name || item.description || 'Unknown item'} 
        {item.quantity && ` (${item.quantity}x)`}
      </div>
    ));
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    try {
      const csvData = filteredOrders.map(order => ({
        'Order ID': formatOrderId(order.id, order.stripe_session_id),
        'Stripe Session ID': order.stripe_session_id || '',
        'Customer Email': order.customer_email,
        'Customer Name': order.customer_name || '',
        'Amount': formatCurrency(order.amount, order.currency),
        'Currency': order.currency.toUpperCase(),
        'Status': order.status,
        'Items': order.items?.map(item => 
          `${item.product_name || item.description || 'Unknown'} (${item.quantity || 1}x)`
        ).join('; ') || 'No items',
        'Created At': format(new Date(order.created_at), 'PPpp'),
        'Updated At': format(new Date(order.updated_at), 'PPpp'),
      }));

      // Simple CSV generation
      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Orders exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export orders');
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error loading orders: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <Button onClick={exportToCSV} variant="outline" disabled={!filteredOrders?.length}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by email..."
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Orders ({filteredOrders?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-muted-foreground">Loading orders...</div>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {orders?.length === 0 ? 'No orders found' : 'No orders match your filters'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {formatOrderId(order.id, order.stripe_session_id)}
                      </TableCell>
                      <TableCell>{order.customer_email}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.amount, order.currency)}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="space-y-1">
                          {renderItems(order.items)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
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
