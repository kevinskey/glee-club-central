
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, CreditCard, Clock, Banknote, AlertTriangle, X } from "lucide-react"; // Added X import
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchPaymentRecords } from "@/utils/supabaseQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FinancialInfoTabProps {
  memberId: string;
}

export const FinancialInfoTab: React.FC<FinancialInfoTabProps> = ({ memberId }) => {
  const { data: paymentRecords, isLoading } = useQuery({
    queryKey: ['paymentRecords', memberId],
    queryFn: () => fetchPaymentRecords(memberId),
    enabled: !!memberId,
  });

  // Mock financial data
  const financialData = {
    total_dues: 200,
    amount_paid: 150,
    fundraiser_participation: [
      { id: 1, name: "Bake Sale", participated: true, amount_raised: 75 },
      { id: 2, name: "Car Wash", participated: false, amount_raised: 0 },
      { id: 3, name: "Benefit Concert", participated: true, amount_raised: 125 },
    ],
    outstanding_fees: [
      { id: 1, description: "Sheet Music Fee", amount: 25, due_date: "2025-05-15" },
      { id: 2, description: "Uniform Maintenance", amount: 25, due_date: "2025-06-01" },
    ]
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 flex items-center gap-1"><Check className="h-3 w-3" /> Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const duesProgress = (financialData.amount_paid / financialData.total_dues) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" /> Dues Balance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">
                ${financialData.amount_paid} paid of ${financialData.total_dues}
              </p>
              <p className="text-sm text-muted-foreground">
                Balance: ${financialData.total_dues - financialData.amount_paid}
              </p>
            </div>
            {financialData.amount_paid >= financialData.total_dues ? (
              <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Paid in Full</Badge>
            ) : (
              <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Partial</Badge>
            )}
          </div>
          <Progress value={duesProgress} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Payment History
          </CardTitle>
          <CardDescription>Record of all payments made</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : paymentRecords && paymentRecords.length > 0 ? (
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
                {paymentRecords.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                    <TableCell>${payment.amount}</TableCell>
                    <TableCell>{payment.payment_method}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.description || "Dues payment"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No payment records found</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fundraiser Participation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {financialData.fundraiser_participation.map((fundraiser) => (
              <div key={fundraiser.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <h4 className="font-medium">{fundraiser.name}</h4>
                  {fundraiser.participated && (
                    <p className="text-sm text-muted-foreground">Raised: ${fundraiser.amount_raised}</p>
                  )}
                </div>
                {fundraiser.participated ? (
                  <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Participated</Badge>
                ) : (
                  <Badge variant="outline"><X className="h-3 w-3 mr-1" /> Did not participate</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding Fees</CardTitle>
          </CardHeader>
          <CardContent>
            {financialData.outstanding_fees.length > 0 ? (
              <div className="space-y-4">
                {financialData.outstanding_fees.map((fee) => (
                  <div key={fee.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h4 className="font-medium">{fee.description}</h4>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(fee.due_date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-medium">${fee.amount}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-muted-foreground">No outstanding fees</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
