
import React from 'react';

interface NewsTickerItemProps {
  headline: string;
  priority: number;
}

export const NewsTickerItem: React.FC<NewsTickerItemProps> = ({ headline, priority }) => {
  const priorityIcon = priority >= 3 ? '🔥' : priority >= 2 ? '⭐' : '📣';
  
  return (
    <span className="mx-4 whitespace-nowrap">
      {priorityIcon} {headline}
    </span>
  );
};
