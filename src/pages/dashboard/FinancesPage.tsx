
import React from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, CreditCard } from "lucide-react";

export default function FinancesPage() {
  // Sample financial data
  const financialStats = [
    {
      title: "Total Dues Collected",
      value: "$12,450",
      icon: <DollarSign className="h-4 w-4" />,
      description: "85% collection rate"
    },
    {
      title: "Outstanding Dues",
      value: "$2,200",
      icon: <TrendingUp className="h-4 w-4" />,
      description: "15% pending"
    },
    {
      title: "Paid Members",
      value: "34/40",
      icon: <Users className="h-4 w-4" />,
      description: "6 members pending"
    },
    {
      title: "Recent Payments",
      value: "8",
      icon: <CreditCard className="h-4 w-4" />,
      description: "This week"
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Management"
        description="Track dues, payments, and financial records"
        icon={<DollarSign className="h-6 w-6" />}
      />
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest dues payments and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">Member {item}</p>
                  <p className="text-sm text-muted-foreground">Semester dues payment</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$250.00</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding Dues */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Dues</CardTitle>
          <CardDescription>Members with pending payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium">Member {item + 5}</p>
                  <p className="text-sm text-muted-foreground">Due date: May 30, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-orange-600">$250.00</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
