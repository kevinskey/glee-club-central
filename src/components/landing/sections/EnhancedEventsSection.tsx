
import React from "react";
import { MobileOptimizedEventsSection } from "./MobileOptimizedEventsSection";

interface Event {
  id: string;
  title: string;
  date: string;
  location?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

interface EnhancedEventsSectionProps {
  events: Event[];
}

export function EnhancedEventsSection({ events }: EnhancedEventsSectionProps) {
  console.log('🎭 EnhancedEventsSection: Using MobileOptimizedEventsSection instead');
  
  return (
    <MobileOptimizedEventsSection 
      maxEvents={6}
      showHeader={true}
      className="bg-gradient-to-br from-background to-muted/20"
    />
  );
}
