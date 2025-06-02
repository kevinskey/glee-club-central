
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, GraduationCap, Flag, Church, Music, Users, MapPin, Clock, Star } from 'lucide-react';

interface EventCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

interface EventCategoryFilterProps {
  enabledCategories: string[];
  onCategoryToggle: (categoryId: string, enabled: boolean) => void;
  eventCounts?: Record<string, number>;
}

export function EventCategoryFilter({ 
  enabledCategories, 
  onCategoryToggle, 
  eventCounts = {} 
}: EventCategoryFilterProps) {
  const categories: EventCategory[] = [
    {
      id: 'rehearsal',
      label: 'Rehearsals',
      description: 'Practice sessions and vocal training',
      icon: <Music className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      count: eventCounts.rehearsal || 0
    },
    {
      id: 'performance',
      label: 'Performances',
      description: 'Concerts and public shows',
      icon: <Star className="h-4 w-4" />,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      count: eventCounts.performance || 0
    },
    {
      id: 'meeting',
      label: 'Meetings',
      description: 'Administrative and planning meetings',
      icon: <Users className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      count: eventCounts.meeting || 0
    },
    {
      id: 'event',
      label: 'General Events',
      description: 'Other club activities and events',
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-green-100 text-green-700 border-green-300',
      count: eventCounts.event || 0
    },
    {
      id: 'academic',
      label: 'Academic Dates',
      description: 'Spelman College important dates',
      icon: <GraduationCap className="h-4 w-4" />,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      count: eventCounts.academic || 0
    },
    {
      id: 'holiday',
      label: 'National Holidays',
      description: 'US federal and national holidays',
      icon: <Flag className="h-4 w-4" />,
      color: 'bg-red-100 text-red-700 border-red-300',
      count: eventCounts.holiday || 0
    },
    {
      id: 'religious',
      label: 'Religious Holidays',
      description: 'Christian, Jewish, Islamic and other holidays',
      icon: <Church className="h-4 w-4" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      count: eventCounts.religious || 0
    },
    {
      id: 'travel',
      label: 'Travel & Tours',
      description: 'Away performances and travel events',
      icon: <MapPin className="h-4 w-4" />,
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      count: eventCounts.travel || 0
    }
  ];

  const enabledCount = enabledCategories.length;
  const totalCategories = categories.length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Event Categories
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Choose which types of events to display on your calendar
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {enabledCount} of {totalCategories} visible
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const isEnabled = enabledCategories.includes(category.id);
            
            return (
              <div
                key={category.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  isEnabled 
                    ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20' 
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${category.color} ${!isEnabled ? 'opacity-50' : ''}`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-medium text-sm ${!isEnabled ? 'text-muted-foreground' : ''}`}>
                          {category.label}
                        </h3>
                        {category.count > 0 && (
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {category.count}
                          </Badge>
                        )}
                      </div>
                      <p className={`text-xs ${!isEnabled ? 'text-muted-foreground' : 'text-gray-600 dark:text-gray-400'}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => onCategoryToggle(category.id, checked)}
                    className="ml-2"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Quick actions:</span>
            <div className="flex gap-2">
              <button
                onClick={() => categories.forEach(cat => onCategoryToggle(cat.id, true))}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Show All
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => categories.forEach(cat => onCategoryToggle(cat.id, false))}
                className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Hide All
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
