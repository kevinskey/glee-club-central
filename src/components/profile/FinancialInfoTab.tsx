
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentRecords } from "@/utils/supabaseQueries";
import { formatDate } from "@/lib/utils";

interface FinancialInfoTabProps {
  memberId: string;
}

export function FinancialInfoTab({ memberId }: FinancialInfoTabProps) {
  const { data: paymentRecords, isLoading } = useQuery({
    queryKey: ['payments', memberId],
    queryFn: () => fetchPaymentRecords(memberId),
  });
  
  // Calculate the balance
  const totalDue = 100; // This would come from a setting in the database
  const totalPaid = paymentRecords?.reduce((sum, payment) => {
    if (payment.status === 'completed') {
      return sum + Number(payment.amount);
    }
    return sum;
  }, 0) || 0;
  const balance = totalDue - totalPaid;
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dues Summary</CardTitle>
          <CardDescription>
            Current dues balance and payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Due</p>
              <p className="text-2xl font-bold">${totalDue.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold">${totalPaid.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-muted rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className={`text-2xl font-bold ${balance > 0 ? 'text-red-500' : 'text-green-500'}`}>
                ${balance.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Record of all payments and transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading payment records...</div>
          ) : !paymentRecords || paymentRecords.length === 0 ? (
            <div className="text-center py-4">No payment records found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.payment_date)}</TableCell>
                    <TableCell>${Number(record.amount).toFixed(2)}</TableCell>
                    <TableCell>{record.payment_method}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.description || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fundraiser Participation</CardTitle>
          <CardDescription>
            Record of fundraising activities and contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <p className="italic text-muted-foreground text-center">
              Fundraiser participation tracking coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
