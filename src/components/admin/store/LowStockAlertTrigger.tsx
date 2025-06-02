
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertTriangle, Send, Clock } from 'lucide-react';

interface LowStockAlertResponse {
  success: boolean;
  message: string;
  details?: {
    lowStockItemsCount: number;
    usersAlerted: number;
    emailFailures: number;
    lowStockItems: Array<{
      name: string;
      stock: number;
    }>;
  };
  error?: string;
}

export function LowStockAlertTrigger() {
  const [isTriggering, setIsTriggering] = useState(false);
  const [lastResult, setLastResult] = useState<LowStockAlertResponse | null>(null);

  const triggerLowStockAlert = async () => {
    setIsTriggering(true);
    try {
      const { data, error } = await supabase.functions.invoke('low-stock-alert', {
        body: { manual_trigger: true, triggered_at: new Date().toISOString() }
      });

      if (error) {
        throw error;
      }

      setLastResult(data);
      
      if (data.success) {
        toast.success(`Low stock alert sent successfully! ${data.details?.usersAlerted || 0} users notified.`);
      } else {
        toast.error(`Alert failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error triggering low stock alert:', error);
      toast.error('Failed to trigger low stock alert');
      setLastResult({
        success: false,
        message: 'Failed to trigger alert',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Low Stock Alert System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            This system automatically checks for items with less than 10 units in stock and sends email alerts to Merchandise Managers and Treasurers daily at 9 AM.
          </p>
          
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Scheduled: Daily at 9:00 AM
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={triggerLowStockAlert}
            disabled={isTriggering}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {isTriggering ? 'Sending Alert...' : 'Test Alert Now'}
          </Button>
        </div>

        {lastResult && (
          <div className="mt-4 p-3 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              Last Alert Result
              <Badge variant={lastResult.success ? "default" : "destructive"}>
                {lastResult.success ? 'Success' : 'Failed'}
              </Badge>
            </h4>
            
            {lastResult.success && lastResult.details ? (
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Low Stock Items:</span> {lastResult.details.lowStockItemsCount}
                  </div>
                  <div>
                    <span className="font-medium">Users Alerted:</span> {lastResult.details.usersAlerted}
                  </div>
                </div>
                
                {lastResult.details.lowStockItems.length > 0 && (
                  <div>
                    <span className="font-medium">Items Needing Attention:</span>
                    <ul className="list-disc list-inside mt-1 text-muted-foreground">
                      {lastResult.details.lowStockItems.map((item, index) => (
                        <li key={index}>
                          {item.name} ({item.stock} units)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-600">
                {lastResult.error || lastResult.message}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
