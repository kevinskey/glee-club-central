
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Music } from 'lucide-react';

interface FavoriteMemory {
  memory: string;
  count: number;
}

interface FavoriteMemoriesListProps {
  data: FavoriteMemory[];
  isLoading?: boolean;
}

export function FavoriteMemoriesList({ data, isLoading }: FavoriteMemoriesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Favorite Memories
        </CardTitle>
        <CardDescription>Most mentioned memories by fans</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-2 text-sm text-muted-foreground">Loading memories...</p>
            </div>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-3">
            {data.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.memory}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-glee-spelman text-white">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Music className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2">No favorite memories shared yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
