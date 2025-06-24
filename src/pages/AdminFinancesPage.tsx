
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthMigration } from '@/hooks/useAuthMigration';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionChecker';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Plus
} from 'lucide-react';

interface FinancialData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  duesCollected: number;
  outstandingDues: number;
  membersPaid: number;
  totalMembers: number;
}

export default function AdminFinancesPage() {
  const { isAdmin, isLoading, isAuthenticated } = useAuthMigration();
  const { user, profile } = useAuth();
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminUser = isAdmin();
  
  // Create user object for permission checking
  const currentUser = {
    ...user,
    role_tags: profile?.role_tags || []
  };
  
  // Check permissions for different actions
  const canViewBudget = isAdminUser || hasPermission(currentUser, 'view_budget');
  const canEditBudget = isAdminUser || hasPermission(currentUser, 'edit_budget');

  useEffect(() => {
    const loadFinancialData = async () => {
      setLoading(true);
      // TODO: Replace with actual API call to fetch financial data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFinancialData({
        totalRevenue: 0,
        totalExpenses: 0,
        netIncome: 0,
        duesCollected: 0,
        outstandingDues: 0,
        membersPaid: 0,
        totalMembers: 0
      });
      setLoading(false);
    };

    if (isAuthenticated && canViewBudget) {
      loadFinancialData();
    }
  }, [isAuthenticated, canViewBudget]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !canViewBudget) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <DollarSign className="h-12 w-12 text-gray-700 dark:text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-gray-700 dark:text-gray-300">
            You don't have permission to view financial information.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Track dues, expenses, and revenue for the Glee Club
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          {canEditBudget && (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : financialData ? (
        <>
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  No data available
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.netIncome.toLocaleString()}</div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  Revenue minus expenses
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Dues Collected</CardTitle>
                <Users className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.duesCollected.toLocaleString()}</div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {financialData.membersPaid} of {financialData.totalMembers} members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Dues</CardTitle>
                <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialData.outstandingDues.toLocaleString()}</div>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {financialData.totalMembers - financialData.membersPaid} members pending
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Latest financial activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <DollarSign className="mx-auto h-10 w-10 mb-2 opacity-30" />
                <p>No transactions recorded yet</p>
                <p className="text-sm">Financial transactions will appear here once recorded</p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="h-12 w-12 text-gray-700 dark:text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Financial Data</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Financial data could not be loaded at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
