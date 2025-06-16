
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export const FinancialSummary: React.FC = () => {
  const { transactions } = useFinancialTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate monthly summary
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd && t.status === 'approved';
  });

  const monthlyIncome = monthlyTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  // Calculate yearly summary
  const yearStart = startOfYear(currentMonth);
  const yearEnd = endOfYear(currentMonth);
  
  const yearlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= yearStart && transactionDate <= yearEnd && t.status === 'approved';
  });

  const yearlyIncome = yearlyTransactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const yearlyExpenses = yearlyTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  // Category breakdown
  const categoryBreakdown = transactions
    .filter(t => t.status === 'approved')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = { income: 0, expense: 0, total: 0 };
      }
      
      if (transaction.transaction_type === 'income') {
        acc[category].income += Number(transaction.amount);
      } else {
        acc[category].expense += Math.abs(Number(transaction.amount));
      }
      
      acc[category].total = acc[category].income - acc[category].expense;
      return acc;
    }, {} as Record<string, { income: number; expense: number; total: number }>);

  return (
    <div className="space-y-6">
      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            Monthly Summary - {format(currentMonth, 'MMMM yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(monthlyIncome)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Income</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(monthlyExpenses)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${(monthlyIncome - monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyIncome - monthlyExpenses)}
              </div>
              <p className="text-sm text-muted-foreground">Monthly Net</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            Yearly Summary - {format(currentMonth, 'yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(yearlyIncome)}
              </div>
              <p className="text-sm text-muted-foreground">Yearly Income</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(yearlyExpenses)}
              </div>
              <p className="text-sm text-muted-foreground">Yearly Expenses</p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${(yearlyIncome - yearlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(yearlyIncome - yearlyExpenses)}
              </div>
              <p className="text-sm text-muted-foreground">Yearly Net</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(categoryBreakdown)
              .sort(([,a], [,b]) => Math.abs(b.total) - Math.abs(a.total))
              .map(([category, data]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Income: {formatCurrency(data.income)} | 
                    Expenses: {formatCurrency(data.expense)}
                  </div>
                </div>
                <div className={`font-semibold ${data.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.total)}
                </div>
              </div>
            ))}
            
            {Object.keys(categoryBreakdown).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No financial data available for category breakdown.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
