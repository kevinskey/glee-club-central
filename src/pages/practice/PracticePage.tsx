
import React, { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { usePracticeLogs } from "@/hooks/usePracticeLogs";
import { PracticeLogForm } from "@/components/practice/PracticeLogForm";
import { PracticeLogsList } from "@/components/practice/PracticeLogsList";
import { PracticeStats } from "@/components/practice/PracticeStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Target, Calendar, TrendingUp, Music, Plus } from "lucide-react";
import { PageLoader } from "@/components/ui/page-loader";
import { toast } from "sonner";

interface PracticeLog {
  id?: string;
  user_id?: string;
  duration: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export default function PracticePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { logs, loading: logsLoading, fetchLogs, addLog } = usePracticeLogs();
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      fetchLogs();
    }
  }, [user, authLoading, fetchLogs]);

  if (authLoading || profileLoading || logsLoading) {
    return <PageLoader message="Loading practice data..." />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to access practice tracking.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleAddPracticeLog = async (minutes: number, category: string, description: string, date?: string) => {
    try {
      const success = await addLog({
        duration: minutes,
        notes: description,
        user_id: user.id
      });
      
      if (success) {
        toast.success("Practice session logged successfully!");
        setShowAddForm(false);
        fetchLogs();
        return true;
      } else {
        toast.error("Failed to log practice session");
        return false;
      }
    } catch (error) {
      console.error('Error adding practice log:', error);
      toast.error("An error occurred while logging your practice session");
      return false;
    }
  };

  // Calculate total practice time
  const totalMinutes = logs.reduce((total, log) => total + (log.duration || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Practice Tracking</h1>
          <p className="text-muted-foreground">
            Track your individual practice sessions and progress
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Log Practice Session
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="font-semibold">
                  {totalHours}h {remainingMinutes}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="font-semibold">{logs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Session</p>
                <p className="font-semibold">
                  {logs.length > 0 ? Math.round(totalMinutes / logs.length) : 0}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="font-semibold">
                  {logs.filter(log => {
                    const logDate = new Date(log.created_at || '');
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return logDate > weekAgo;
                  }).length} sessions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="logs" className="w-full">
        <TabsList>
          <TabsTrigger value="logs">Practice Logs</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logs" className="space-y-4">
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Log Practice Session</CardTitle>
                <CardDescription>
                  Record your individual practice time and notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PracticeLogForm
                  onSubmit={handleAddPracticeLog}
                  onCancel={() => setShowAddForm(false)}
                />
              </CardContent>
            </Card>
          )}
          
          {logs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Practice Sessions Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your practice sessions to see your progress over time.
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Log Your First Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">Practice Session</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(log.created_at || '').toLocaleDateString()}
                        </p>
                        {log.notes && (
                          <p className="text-sm mt-2">{log.notes}</p>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {log.duration} minutes
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Practice Statistics</CardTitle>
              <CardDescription>
                Your practice progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Statistics visualization coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
