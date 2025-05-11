
import React from 'react';
import { Button } from '@/components/ui/button';

export interface VideoFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function VideoFilters({ selectedCategory, onCategoryChange }: VideoFiltersProps) {
  const categories = [
    { id: 'all', name: 'All Videos' },
    { id: 'performance', name: 'Performances' },
    { id: 'rehearsal', name: 'Rehearsals' },
    { id: 'tour', name: 'Tour' },
    { id: 'events', name: 'Events' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="rounded-full"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
