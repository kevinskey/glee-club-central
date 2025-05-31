
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { BarChart3 } from "lucide-react";

interface AdminAnalyticsChartProps {
  isMobile?: boolean;
}

const chartData = [
  { name: "Jan", members: 78, events: 4, engagement: 85 },
  { name: "Feb", members: 82, events: 6, engagement: 88 },
  { name: "Mar", members: 85, events: 8, engagement: 92 },
  { name: "Apr", members: 83, events: 5, engagement: 87 },
  { name: "May", members: 85, events: 7, engagement: 94 },
  { name: "Jun", members: 87, events: 9, engagement: 96 }
];

export function AdminAnalyticsChart({ isMobile = false }: AdminAnalyticsChartProps) {
  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          Analytics Overview
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Member growth and engagement trends
        </p>
      </CardHeader>
      <CardContent>
        <div className={`${isMobile ? 'h-64' : 'h-80'} w-full`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                className="dark:stroke-gray-400"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                className="dark:stroke-gray-400"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                className="dark:bg-gray-800 dark:border-gray-700"
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="members"
                stackId="1"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorMembers)"
                name="Members"
              />
              <Area
                type="monotone"
                dataKey="events"
                stackId="2"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorEvents)"
                name="Events"
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                name="Engagement %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
