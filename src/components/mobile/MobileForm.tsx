
import React from 'react';
import { cn } from '@/lib/utils';

interface MobileFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
  spacing?: 'tight' | 'normal' | 'relaxed';
}

interface MobileFormFieldProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
}

export function MobileForm({ 
  children, 
  className,
  onSubmit,
  spacing = 'normal'
}: MobileFormProps) {
  const spacingClasses = {
    tight: 'space-y-3',
    normal: 'space-y-4',
    relaxed: 'space-y-6'
  };

  return (
    <form 
      className={cn(
        'w-full',
        spacingClasses[spacing],
        className
      )}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

export function MobileFormField({ 
  children, 
  className,
  label,
  error,
  required = false
}: MobileFormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
