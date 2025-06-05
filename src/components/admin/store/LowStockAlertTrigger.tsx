
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  quantity_in_stock: number;
  price: number;
}

interface LowStockAlertTriggerProps {
  items: StoreItem[];
}

export function LowStockAlertTrigger({ items }: LowStockAlertTriggerProps) {
  if (items.length === 0) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Low Stock Alert</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <div className="mt-2">
          <p className="mb-2">The following items are running low on stock:</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Badge key={item.id} variant="outline" className="bg-white">
                {item.name} ({item.quantity_in_stock} left)
              </Badge>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
