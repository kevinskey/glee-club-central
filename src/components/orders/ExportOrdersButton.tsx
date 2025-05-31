
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Order {
  id: string;
  stripe_session_id: string;
  customer_email: string;
  customer_name?: string;
  amount: number;
  currency: string;
  status: string;
  items: any[];
  created_at: string;
  updated_at: string;
}

interface ExportOrdersButtonProps {
  orders: Order[];
}

export function ExportOrdersButton({ orders }: ExportOrdersButtonProps) {
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

  const exportToCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error('No orders to export');
      return;
    }

    try {
      const csvData = orders.map(order => ({
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

      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          }).join(',')
        )
      ].join('\n');

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

  return (
    <Button onClick={exportToCSV} variant="outline" disabled={!orders?.length}>
      <Download className="w-4 h-4 mr-2" />
      Export CSV
    </Button>
  );
}
