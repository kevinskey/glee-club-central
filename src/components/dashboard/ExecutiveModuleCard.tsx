
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface ExecutiveModuleCardProps {
  title: string;
  description: string;
  to: string;
  icon?: LucideIcon;
  variant?: 'default' | 'secondary';
}

export function ExecutiveModuleCard({ 
  title, 
  description, 
  to, 
  icon: Icon,
  variant = 'default'
}: ExecutiveModuleCardProps) {
  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-md w-full ${
      variant === 'secondary' ? 'border-muted bg-muted/30' : 'hover:border-glee-spelman/20'
    }`}>
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {Icon && (
            <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
              variant === 'secondary' 
                ? 'bg-muted-foreground/10' 
                : 'bg-glee-spelman/10'
            }`}>
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                variant === 'secondary' 
                  ? 'text-muted-foreground' 
                  : 'text-glee-spelman'
              }`} />
            </div>
          )}
          <CardTitle className="text-base sm:text-lg leading-tight">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4 px-4 sm:px-6">
        <CardDescription className="text-sm leading-relaxed text-left">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 px-4 sm:px-6">
        <Button 
          asChild 
          className="w-full group text-sm"
          variant={variant === 'secondary' ? 'outline' : 'default'}
          disabled={variant === 'secondary'}
          size="sm"
        >
          <Link to={to} className="flex items-center justify-center gap-2">
            {variant === 'secondary' ? 'Not Available' : 'Open Tool'}
            {variant !== 'secondary' && (
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
