
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useFinancialBudgets } from '@/hooks/useFinancialBudgets';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { AddBudgetDialog } from './AddBudgetDialog';

export const BudgetTracker: React.FC = () => {
  const { budgets, loading: budgetsLoading } = useFinancialBudgets();
  const { transactions } = useFinancialTransactions();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getSpentAmount = (category: string) => {
    return transactions
      .filter(t => 
        t.category.toLowerCase() === category.toLowerCase() && 
        t.transaction_type === 'expense' && 
        t.status === 'approved'
      )
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 60) return 'bg-green-500';
    if (percentage <= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage <= 60) return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
    if (percentage <= 80) return <Badge className="bg-yellow-100 text-yellow-800">Caution</Badge>;
    if (percentage <= 100) return <Badge className="bg-orange-100 text-orange-800">Near Limit</Badge>;
    return <Badge variant="destructive">Over Budget</Badge>;
  };

  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 1}`;
  const currentYearBudgets = budgets.filter(b => b.academic_year === academicYear);

  if (budgetsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-glee-spelman mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading budget data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Budget Overview - Academic Year {academicYear}</CardTitle>
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Budget
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentYearBudgets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No budgets have been created for the current academic year.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Budget
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {currentYearBudgets.map((budget) => {
                const spent = getSpentAmount(budget.category);
                const spentPercentage = (spent / budget.budgeted_amount) * 100;
                const remaining = budget.budgeted_amount - spent;
                
                return (
                  <div key={budget.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{budget.category}</h3>
                        {getStatusBadge(spentPercentage)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(spent)} of {formatCurrency(budget.budgeted_amount)}
                      </div>
                    </div>
                    
                    <Progress 
                      value={Math.min(spentPercentage, 100)} 
                      className="h-3"
                    />
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {spentPercentage.toFixed(1)}% used
                      </span>
                      <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                        {formatCurrency(Math.abs(remaining))}
                      </span>
                    </div>
                    
                    {budget.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        {budget.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AddBudgetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};
