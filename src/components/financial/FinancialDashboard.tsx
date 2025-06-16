
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Download,
  Calculator
} from 'lucide-react';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { FinancialLedger } from './FinancialLedger';
import { AddTransactionDialog } from './AddTransactionDialog';
import { FinancialSummary } from './FinancialSummary';
import { BudgetTracker } from './BudgetTracker';
import { BudgetBuilder } from './BudgetBuilder';
import { FinancialMobileMenu } from './FinancialMobileMenu';
import { FinancialDesktopTabs } from './FinancialDesktopTabs';

export const FinancialDashboard: React.FC = () => {
  const { totalIncome, totalExpenses, netBalance, loading } = useFinancialTransactions();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('ledger');

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ledger':
        return <FinancialLedger />;
      case 'budget-builder':
        return <BudgetBuilder />;
      case 'budget-tracker':
        return <BudgetTracker />;
      case 'summary':
        return <FinancialSummary />;
      case 'reports':
        return (
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
        );
      default:
        return <FinancialLedger />;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0072CE] font-playfair">
            Financial Management
          </h1>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mt-2">
            Comprehensive financial tracking, budgeting, and reporting
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="flex-1 md:flex-none">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)} size="sm" className="flex-1 md:flex-none">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-semibold">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-1">
              All approved income transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-semibold">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-1">
              All approved expense transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm md:text-lg font-semibold">Net Balance</CardTitle>
            <Calculator className="h-4 w-4 md:h-5 md:w-5 text-[#0072CE]" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl md:text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </div>
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mt-1">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Dropdown Navigation */}
      <FinancialMobileMenu activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Desktop Tab Navigation */}
      <FinancialDesktopTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
};
