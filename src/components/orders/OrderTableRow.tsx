
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
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

interface OrderTableRowProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function OrderTableRow({ order, onViewDetails }: OrderTableRowProps) {
  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatOrderId = (id: string, stripeSessionId?: string) => {
    if (stripeSessionId) {
      return stripeSessionId.slice(-8);
    }
    return id.slice(-6);
  };

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

  const renderItems = (items: any[]) => {
    if (!items || items.length === 0) return 'No items';
    
    return items.map((item, index) => (
      <div key={index} className="text-sm">
        {item.product_name || item.description || 'Unknown item'} 
        {item.quantity && ` (${item.quantity}x)`}
      </div>
    ));
  };

  return (
    <TableRow>
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
          onClick={() => onViewDetails(order)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
