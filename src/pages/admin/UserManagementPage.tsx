
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, UserCheck, UserX } from 'lucide-react';
import CleanAdminUsers from '@/components/admin/CleanAdminUsers';

const UserManagementPage: React.FC = () => {
  console.log('🔧 UserManagementPage: Rendering CleanAdminUsers component');
  
  const userStats = [
    {
      title: 'Total Members',
      value: '42',
      icon: Users,
      change: '+3 this month',
      color: 'text-blue-600'
    },
    {
      title: 'New Members',
      value: '5',
      icon: UserPlus,
      change: 'This month',
      color: 'text-green-600'
    },
    {
      title: 'Active Members',
      value: '38',
      icon: UserCheck,
      change: '90% active',
      color: 'text-purple-600'
    },
    {
      title: 'Inactive',
      value: '4',
      icon: UserX,
      change: '10% inactive',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Welcome Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-navy-900 dark:text-white font-playfair">
          User Management
        </h1>
        <Badge variant="outline" className="px-3 py-1 text-xs">
          Member Administration
        </Badge>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {userStats.map((stat, index) => {
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

      {/* User Management Component */}
      <div className="mb-8">
        <CleanAdminUsers />
      </div>
    </div>
  );
};

export default UserManagementPage;
