
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { Headphones, Book, MusicIcon, Clock, Pencil, Trash, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { type PracticeLog } from "@/utils/supabase/practiceLogs";
import { PracticeLogForm } from "./PracticeLogForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PracticeLogsListProps {
  logs: PracticeLog[];
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<Omit<PracticeLog, "id" | "user_id" | "created_at" | "updated_at">>) => Promise<boolean>;
  isLoading?: boolean;
}

export function PracticeLogsList({ logs, onDelete, onUpdate, isLoading = false }: PracticeLogsListProps) {
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);

  const handleUpdate = async (
    minutes: number,
    category: string,
    description: string | null,
    date?: string
  ) => {
    if (!editingLogId) return false;
    
    const success = await onUpdate(editingLogId, {
      minutes_practiced: minutes,
      category,
      description,
      ...(date ? { date } : {})
    });
    
    if (success) {
      setEditingLogId(null);
    }
    
    return success;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'warmups': return <Headphones className="h-5 w-5 text-blue-500" />;
      case 'sectionals': return <MusicIcon className="h-5 w-5 text-purple-500" />;
      case 'full': return <MusicIcon className="h-5 w-5 text-green-500" />;
      case 'sightreading': return <Book className="h-5 w-5 text-orange-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'warmups': return 'Warm-ups';
      case 'sectionals': return 'Sectional Practice';
      case 'full': return 'Full Choir Music';
      case 'sightreading': return 'Sight Reading';
      default: return 'Other Practice';
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Loading practice history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <MusicIcon className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">No practice sessions recorded</h3>
            <p className="text-sm text-muted-foreground">
              Log your practice sessions to track your progress over time.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <Card key={log.id} className={editingLogId === log.id ? "border-primary" : ""}>
          {editingLogId === log.id ? (
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Edit Practice Log</h3>
              <PracticeLogForm
                onSubmit={handleUpdate}
                defaultValues={{
                  minutes: log.minutes_practiced,
                  category: log.category,
                  description: log.description || "",
                  date: log.date
                }}
                isEditing
                onCancel={() => setEditingLogId(null)}
              />
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(log.category)}
                    <CardTitle className="text-lg">{getCategoryName(log.category)}</CardTitle>
                  </div>
                  <CardDescription>
                    {format(parseISO(log.date), "MMMM d, yyyy")} • {log.minutes_practiced} minutes
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingLogId(log.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(log.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pt-0">
                {log.description && <p className="text-sm mt-2">{log.description}</p>}
              </CardContent>
            </>
          )}
        </Card>
      ))}

      <AlertDialog open={!!showDeleteDialog} onOpenChange={(open) => !open && setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Practice Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this practice log? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (showDeleteDialog) {
                  await onDelete(showDeleteDialog);
                  setShowDeleteDialog(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
