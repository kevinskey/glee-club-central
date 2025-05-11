
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { LucideIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon?: React.ReactNode;
  chart?: boolean;
  change?: number;
  isLoading?: boolean;
}

export function AnalyticsCard({ 
  title, 
  value, 
  description, 
  icon, 
  chart, 
  change,
  isLoading = false
}: AnalyticsCardProps) {
  const chartData = [
    { name: "Jan", total: Math.floor(Math.random() * 5000) },
    { name: "Feb", total: Math.floor(Math.random() * 5000) },
    { name: "Mar", total: Math.floor(Math.random() * 5000) },
    { name: "Apr", total: Math.floor(Math.random() * 5000) },
    { name: "May", total: Math.floor(Math.random() * 5000) },
    { name: "Jun", total: Math.floor(Math.random() * 5000) },
  ];
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon && <div>{icon}</div>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-10">
            <Spinner size="sm" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
                {change !== undefined && (
                  <span className={`ml-1 ${change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {change >= 0 ? '+' : ''}{change}%
                  </span>
                )}
              </p>
            )}
            {chart && (
              <div className="h-[80px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <Bar dataKey="total" className="fill-primary" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
