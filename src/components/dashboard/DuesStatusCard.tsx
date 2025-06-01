
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/contexts/ProfileContext';
import { CreditCard, Calendar } from 'lucide-react';

export function DuesStatusCard() {
  const { profile } = useProfile();
  const duesPaid = profile?.dues_paid || false;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-glee-spelman" />
            Dues Status
          </CardTitle>
          <Badge variant={duesPaid ? "success" : "destructive"}>
            {duesPaid ? "Paid" : "Unpaid"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Semester:</span>
            <span className="font-medium">Spring 2025</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Amount:</span>
            <span className="font-medium">$50.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Due Date:</span>
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span className="font-medium">January 15, 2025</span>
            </div>
          </div>
          
          {!duesPaid && (
            <div className="pt-2">
              <Button variant="secondary" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Dues Now
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Pay online or see the Treasurer for cash or check payments.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
