
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export const BudgetTracker: React.FC = () => {
  // Placeholder data - will be connected to actual budget data later
  const budgetCategories = [
    { name: 'Travel', budgeted: 5000, spent: 3250, remaining: 1750 },
    { name: 'Meals', budgeted: 2000, spent: 1800, remaining: 200 },
    { name: 'Equipment', budgeted: 1500, spent: 750, remaining: 750 },
    { name: 'Marketing', budgeted: 800, spent: 600, remaining: 200 },
    { name: 'Administrative', budgeted: 1000, spent: 450, remaining: 550 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Overview - Academic Year 2024-2025</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgetCategories.map((category) => {
              const spentPercentage = (category.spent / category.budgeted) * 100;
              
              return (
                <div key={category.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{category.name}</h3>
                      {getStatusBadge(spentPercentage)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(category.spent)} of {formatCurrency(category.budgeted)}
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
                    <span className={category.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {category.remaining >= 0 ? 'Remaining: ' : 'Over by: '}
                      {formatCurrency(Math.abs(category.remaining))}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Budget Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Budget management features and budget vs. actual reporting coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
