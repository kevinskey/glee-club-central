
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit } from "lucide-react";
import { PracticeLog } from "@/utils/supabase/practiceLogs";

interface PracticeLogsListProps {
  logs?: PracticeLog[];
  onDelete?: (id: string) => void;
  onUpdate?: (log: PracticeLog) => void;
}

export function PracticeLogsList({ 
  logs = [], 
  onDelete = () => {}, 
  onUpdate = () => {} 
}: PracticeLogsListProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'warmups':
        return 'bg-blue-100 text-blue-800';
      case 'sectionals':
        return 'bg-purple-100 text-purple-800';
      case 'full':
        return 'bg-green-100 text-green-800';
      case 'sightreading':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'warmups':
        return 'Warm-ups';
      case 'sectionals':
        return 'Sectionals';
      case 'full':
        return 'Full Choir';
      case 'sightreading':
        return 'Sight Reading';
      default:
        return 'Other';
    }
  };

  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-48">
          <p className="text-muted-foreground">No practice logs yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Start logging your practice sessions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(log.category)}>
                  {getCategoryLabel(log.category)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {log.minutes_practiced} minutes
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Date(log.date).toLocaleDateString()}
                </span>
              </div>
              {log.description && (
                <p className="text-sm text-muted-foreground">{log.description}</p>
              )}
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdate(log)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(log.id)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
