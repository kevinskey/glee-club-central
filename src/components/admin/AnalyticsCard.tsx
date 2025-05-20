
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface AnalyticsCardProps {
  title: string;
  value: number | string;
  description?: string;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function AnalyticsCard({
  title,
  value,
  description,
  change,
  icon,
  className,
  isLoading = false,
}: AnalyticsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              {isLoading ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <h3 className="text-2xl font-bold">{value}</h3>
              )}
              {change !== undefined && (
                <div className={cn(
                  "text-xs font-medium",
                  change > 0 ? "text-green-500" : "text-red-500"
                )}>
                  {change > 0 ? "+" : ""}{change}%
                </div>
              )}
            </div>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          {icon && (
            <div className="rounded-full bg-primary/10 p-2.5">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
