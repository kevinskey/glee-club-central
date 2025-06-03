
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
    <Card className={`h-full transition-all duration-200 hover:shadow-md ${
      variant === 'secondary' ? 'border-muted bg-muted/30' : 'hover:border-glee-spelman/20'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`p-2 rounded-lg ${
              variant === 'secondary' 
                ? 'bg-muted-foreground/10' 
                : 'bg-glee-spelman/10'
            }`}>
              <Icon className={`h-5 w-5 ${
                variant === 'secondary' 
                  ? 'text-muted-foreground' 
                  : 'text-glee-spelman'
              }`} />
            </div>
          )}
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          asChild 
          className="w-full group"
          variant={variant === 'secondary' ? 'outline' : 'default'}
          disabled={variant === 'secondary'}
        >
          <Link to={to} className="flex items-center justify-center gap-2">
            {variant === 'secondary' ? 'Not Available' : 'Open Tool'}
            {variant !== 'secondary' && (
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
