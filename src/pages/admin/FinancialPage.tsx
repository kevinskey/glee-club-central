
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';
import { FinancialDashboard } from '@/components/financial/FinancialDashboard';

const FinancialPage: React.FC = () => {
  const financialStats = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      icon: DollarSign,
      change: '+8% this month',
      color: 'text-green-600'
    },
    {
      title: 'Monthly Growth',
      value: '+12.5%',
      icon: TrendingUp,
      change: 'vs last month',
      color: 'text-blue-600'
    },
    {
      title: 'Pending Dues',
      value: '$2,340',
      icon: CreditCard,
      change: '15 members',
      color: 'text-orange-600'
    },
    {
      title: 'Budget Balance',
      value: '$8,750',
      icon: PiggyBank,
      change: '78% remaining',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white font-playfair">
          Financial Management
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Financial Dashboard
        </Badge>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {financialStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-2 pt-2">
                <CardTitle className="text-xs font-medium text-gray-900 dark:text-white">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-2">
                <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Financial Dashboard Component */}
      <div className="mb-8">
        <FinancialDashboard />
      </div>
    </div>
  );
};

export default FinancialPage;
