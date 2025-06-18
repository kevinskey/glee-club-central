import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

interface UserOrder {
  id: string;
  user_id: string;
  item_ids: string[];
  total_price: number;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  shipping_address?: string;
  created_at: string;
}

interface UserOrderDetailsDialogProps {
  order: UserOrder;
  isOpen: boolean;
  onClose: () => void;
}

export function UserOrderDetailsDialog({ order, isOpen, onClose }: UserOrderDetailsDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

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

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Order ID</label>
              <p className="font-mono text-sm break-all">{order.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total</label>
              <p className="font-semibold">{formatCurrency(order.total_price)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Placed On</label>
              <p>{format(new Date(order.created_at), 'PPP')}</p>
            </div>
          </div>

          {order.item_ids && order.item_ids.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Items</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {order.item_ids.map(id => (
                    <li key={id} className="font-mono text-sm break-all">
                      {id}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {order.shipping_address && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                <p className="whitespace-pre-line">{order.shipping_address}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
