
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AnnouncementBannerProps {
  message: string;
  link?: {
    text: string;
    url: string;
  };
}

export function AnnouncementBanner({ message, link }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();
  
  // Check localStorage to see if banner was dismissed
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('announcement-banner-dismissed');
    if (bannerDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);
  
  // Handle banner dismissal
  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-banner-dismissed', 'true');
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-glee-spelman text-white w-full">
      <div className={`${isMobile ? 'px-3 py-2' : 'px-4 py-2'} flex items-center justify-between`}>
        <div className="flex items-center justify-center w-full">
          <p className={`text-center ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {message}
            {link && (
              <a 
                href={link.url} 
                className="ml-2 underline font-medium"
                target="_blank" 
                rel="noopener noreferrer"
              >
                {link.text}
              </a>
            )}
          </p>
        </div>
        <button onClick={handleDismiss} className="flex-shrink-0">
          <X className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
        </button>
      </div>
    </div>
  );
}
