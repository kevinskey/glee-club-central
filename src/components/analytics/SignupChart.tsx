
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Spinner } from '@/components/ui/spinner';

interface SignupData {
  date: string;
  count: number;
}

interface SignupChartProps {
  data: SignupData[];
  isLoading?: boolean;
}

export function SignupChart({ data, isLoading }: SignupChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fan Signup Trends</CardTitle>
        <CardDescription>Daily signups over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-muted-foreground">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [value, 'Signups']}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8B2635" 
                  strokeWidth={2}
                  dot={{ fill: '#8B2635', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
