
import React from 'react';
import { Calendar, Music, Bell, User, BookOpen, Headphones } from 'lucide-react';

export interface QuickAccessTile {
  title: string;
  icon: string;
  href: string;
  color: string;
}

export interface QuickAccessProps {
  tiles: QuickAccessTile[];
}

export const QuickAccess: React.FC<QuickAccessProps> = ({ tiles }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tiles.map((tile, index) => {
        // Determine which icon to use based on the string name
        let IconComponent;
        switch (tile.icon) {
          case 'Calendar':
            IconComponent = Calendar;
            break;
          case 'Bell':
            IconComponent = Bell;
            break;
          case 'User':
            IconComponent = User;
            break;
          case 'BookOpen':
            IconComponent = BookOpen;
            break;
          case 'Headphones':
            IconComponent = Headphones;
            break;
          default:
            IconComponent = Music;
        }
        
        // Use Columbia blue as default if no color specified
        const color = tile.color || 'bg-columbia-blue hover:bg-columbia-blue/90';
        
        return (
          <a 
            key={index} 
            href={tile.href}
            className={`${color} text-white rounded-lg p-6 shadow-md hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center space-x-4">
              <IconComponent size={24} />
              <h3 className="text-lg font-semibold">{tile.title}</h3>
            </div>
          </a>
        );
      })}
    </div>
  );
};
