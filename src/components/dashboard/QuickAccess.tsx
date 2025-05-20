
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface QuickAccessTile {
  title: string;
  icon: React.ReactNode;
  href: string;
  color?: string;
}

interface QuickAccessProps {
  tiles?: QuickAccessTile[];
  className?: string;
}

export function QuickAccess({ tiles, className }: QuickAccessProps) {
  const defaultTiles: QuickAccessTile[] = [
    // Default tiles if none are provided
  ];
  
  const displayTiles = tiles || defaultTiles;
  
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4", className)}>
      {displayTiles.map((tile, index) => (
        <Link
          key={index}
          to={tile.href}
          className={cn(
            "rounded-xl shadow-sm h-24 flex flex-col items-center justify-center text-white transition-transform hover:scale-105",
            tile.color || "bg-gradient-to-br from-blue-600 to-blue-700"
          )}
        >
          <div className="mb-2">{tile.icon}</div>
          <span className="text-sm font-medium">{tile.title}</span>
        </Link>
      ))}
    </div>
  );
}
