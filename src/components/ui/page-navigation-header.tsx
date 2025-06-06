
import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PageNavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  className?: string;
}

export function PageNavigationHeader({ 
  title, 
  showBackButton = true, 
  showHomeButton = true,
  className = ""
}: PageNavigationHeaderProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/');
    }
  };

  const handleHome = () => {
    navigate(isAuthenticated ? '/dashboard' : '/');
  };

  return (
    <div className={`flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="flex items-center gap-3">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      {showHomeButton && (
        <Button variant="outline" size="sm" onClick={handleHome}>
          <Home className="h-4 w-4 mr-2" />
          {isAuthenticated ? 'Dashboard' : 'Home'}
        </Button>
      )}
    </div>
  );
}
