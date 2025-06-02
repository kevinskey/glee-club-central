
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useUserOrders } from '@/hooks/useUserOrders';
import { Spinner } from '@/components/ui/spinner';

interface UserOrder {
  id: string;
  user_id: string;
  item_ids: string[];
  total_price: number;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  shipping_address?: string;
  created_at: string;
}

interface UserOrdersTableProps {
  onViewDetails?: (order: UserOrder) => void;
}

export function UserOrdersTable({ onViewDetails }: UserOrdersTableProps) {
  const { orders, isLoading, updateOrderStatus, isUpdatingStatus } = useUserOrders();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
      case 'fulfilled':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-muted-foreground">Loading your orders...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders ({orders?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {orders?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {order.item_ids.length} item{order.item_ids.length !== 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total_price)}
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
                      {onViewDetails && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(order)}
                        >
                          View Details
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
