
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

interface OrderDetailsModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
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

  const renderShippingAddress = (address: any) => {
    if (!address) return 'No shipping address';
    
    const { name, address: addr } = address;
    
    return (
      <div className="space-y-1">
        {name && <div className="font-medium">{name}</div>}
        {addr && (
          <>
            {addr.line1 && <div>{addr.line1}</div>}
            {addr.line2 && <div>{addr.line2}</div>}
            <div>
              {addr.city && `${addr.city}, `}
              {addr.state && `${addr.state} `}
              {addr.postal_code}
            </div>
            {addr.country && <div>{addr.country}</div>}
          </>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Order ID</label>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Stripe Session ID</label>
              <p className="font-mono text-sm break-all">{order.stripe_session_id || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
              <p className="text-lg font-semibold">{formatCurrency(order.amount, order.currency)}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{order.customer_email}</p>
              </div>
              {order.customer_name && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p>{order.customer_name}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Items</h3>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {item.product_name || item.description || 'Unknown Item'}
                      </h4>
                      {item.price_data && (
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.price_data.unit_amount || 0, item.currency || order.currency)}
                          {item.quantity && ` × ${item.quantity}`}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {item.quantity && (
                        <p className="text-sm font-medium">Qty: {item.quantity}</p>
                      )}
                      {item.amount_total && (
                        <p className="font-semibold">
                          {formatCurrency(item.amount_total, item.currency || order.currency)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No items found</p>
            )}
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
                <div className="p-3 border rounded-lg">
                  {renderShippingAddress(order.shipping_address)}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p>{format(new Date(order.created_at), 'PPpp')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p>{format(new Date(order.updated_at), 'PPpp')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
