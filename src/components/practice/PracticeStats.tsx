
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, Book, MusicIcon, Clock, BarChart } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PracticeStatsProps {
  stats?: Record<string, number>;
  totalMinutes?: number;
}

export function PracticeStats({ stats = {}, totalMinutes = 0 }: PracticeStatsProps) {
  const chartData = Object.entries(stats).map(([category, minutes]) => {
    let name: string;
    let color: string;
    
    switch (category) {
      case 'warmups':
        name = 'Warm-ups';
        color = '#3498db';
        break;
      case 'sectionals':
        name = 'Sectionals';
        color = '#9b59b6';
        break;
      case 'full':
        name = 'Full Choir';
        color = '#2ecc71';
        break;
      case 'sightreading':
        name = 'Sight Reading';
        color = '#e67e22';
        break;
      default:
        name = 'Other';
        color = '#7f8c8d';
    }
    
    return {
      name,
      minutes,
      color
    };
  }).sort((a, b) => b.minutes - a.minutes);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Practice Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">{totalMinutes} minutes</p>
          <p className="text-sm text-muted-foreground">Total practice time logged</p>
        </div>

        {Object.keys(stats).length > 0 ? (
          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={85} />
                <Tooltip
                  formatter={(value) => [`${value} minutes`, 'Time Practiced']}
                  labelFormatter={(label) => `${label}`}
                />
                <Bar dataKey="minutes" fill="#8884d8" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <rect key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center h-64">
            <MusicIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No practice data</h3>
            <p className="text-sm text-muted-foreground">
              Start logging your practice sessions to see statistics
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
