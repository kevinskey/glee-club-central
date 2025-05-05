
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tags } from "lucide-react";

interface VideoFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function VideoFilters({ categories, selectedCategory, onSelectCategory }: VideoFiltersProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tags className="h-4 w-4 text-muted-foreground" />
        <h3 className="font-medium">Filter by Category</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelectCategory(null)}
          className={cn(
            "text-xs",
            !selectedCategory && "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          All Videos
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            onClick={() => onSelectCategory(category)}
            className={cn(
              "text-xs",
              selectedCategory === category && "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
