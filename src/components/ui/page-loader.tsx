
import React from 'react';
import { Spinner } from './spinner';

interface PageLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = "Loading...", 
  size = "lg",
  className = "min-h-[50vh]"
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Spinner size={size} />
        <p className="mt-4 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export default PageLoader;
