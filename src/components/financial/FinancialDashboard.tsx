
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Download,
  Calculator,
  BarChart3,
  FileText,
  PiggyBank
} from 'lucide-react';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { FinancialLedger } from './FinancialLedger';
import { AddTransactionDialog } from './AddTransactionDialog';
import { FinancialSummary } from './FinancialSummary';
import { BudgetTracker } from './BudgetTracker';
import { BudgetBuilder } from './BudgetBuilder';

export const FinancialDashboard: React.FC = () => {
  const { totalIncome, totalExpenses, netBalance, loading } = useFinancialTransactions();
  const [showAddDialog, setShowAddDialog] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0072CE] mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0072CE] font-playfair">
            Financial Management
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-2">
            Comprehensive financial tracking, budgeting, and reporting
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Total Income</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              All approved income transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Total Expenses</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              All approved expense transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Net Balance</CardTitle>
            <Calculator className="h-5 w-5 text-[#0072CE]" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="ledger" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger value="ledger" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <FileText className="h-4 w-4" />
            Ledger
          </TabsTrigger>
          <TabsTrigger value="budget-builder" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <PiggyBank className="h-4 w-4" />
            Budget Builder
          </TabsTrigger>
          <TabsTrigger value="budget-tracker" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <Calculator className="h-4 w-4" />
            Budget Tracker
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-[#0072CE] data-[state=active]:text-white">
            <Download className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ledger" className="space-y-6 mt-6">
          <FinancialLedger />
        </TabsContent>
        
        <TabsContent value="budget-builder" className="space-y-6 mt-6">
          <BudgetBuilder />
        </TabsContent>
        
        <TabsContent value="budget-tracker" className="space-y-6 mt-6">
          <BudgetTracker />
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-6 mt-6">
          <FinancialSummary />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Generate comprehensive financial reports and export data.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <span className="font-semibold">Income Report</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Monthly and yearly income breakdown</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <span className="font-semibold">Expense Report</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Detailed expense analysis</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <span className="font-semibold">Budget vs Actual</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Compare budgets to actual spending</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col space-y-2">
                    <span className="font-semibold">Export Data</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Download CSV/Excel reports</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};
