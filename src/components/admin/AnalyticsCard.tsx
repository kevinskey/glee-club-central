
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
  icon?: React.ReactNode;
}

export function AnalyticsCard({
  title,
  value,
  change,
  description,
  icon,
}: AnalyticsCardProps) {
  const getChangeDisplay = () => {
    if (change === undefined) return null;
    
    if (change > 0) {
      return (
        <div className="flex items-center text-emerald-500">
          <ArrowUp className="h-4 w-4 mr-1" />
          <span>{change}%</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center text-rose-500">
          <ArrowDown className="h-4 w-4 mr-1" />
          <span>{Math.abs(change)}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-muted-foreground">
          <Minus className="h-4 w-4 mr-1" />
          <span>0%</span>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {getChangeDisplay()}
        </div>
      </CardContent>
    </Card>
  );
}
