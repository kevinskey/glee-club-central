
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/contexts/ProfileContext';
import { usePracticeLogs } from '@/hooks/usePracticeLogs';
import { PageLoader } from '@/components/ui/page-loader';
import { 
  Clock, 
  Calendar, 
  Music, 
  TrendingUp, 
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface PracticeLogEntry {
  id: string;
  date: string;
  minutes_practiced: number;
  category: string;
  description: string;
  created_at: string;
}

export default function PracticePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { logs, loading: logsLoading, fetchLogs, addLog } = usePracticeLogs();
  
  const [newLog, setNewLog] = useState({
    minutes: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile) {
      fetchLogs();
    }
  }, [user, profile, fetchLogs]);

  if (authLoading || profileLoading || logsLoading) {
    return <PageLoader message="Loading practice logs..." />;
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            You must be logged in to access practice logs.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLog.minutes || !newLog.category) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await addLog({
        minutes_practiced: parseInt(newLog.minutes),
        category: newLog.category,
        description: newLog.description,
        date: newLog.date,
        user_id: user.id
      });

      if (success) {
        toast.success('Practice log added successfully!');
        setNewLog({
          minutes: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        await fetchLogs();
      } else {
        toast.error('Failed to add practice log');
      }
    } catch (error) {
      console.error('Error adding practice log:', error);
      toast.error('An error occurred while adding the practice log');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalMinutes = logs.reduce((sum, log) => sum + (log.minutes_practiced || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Practice Log</h1>
        <p className="text-muted-foreground">
          Track your practice sessions and monitor your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Practice Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalHours}h {remainingMinutes}m
            </div>
            <p className="text-xs text-muted-foreground">
              Across {logs.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0h 0m</div>
            <p className="text-xs text-muted-foreground">
              0 sessions this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Session</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logs.length > 0 ? Math.round(totalMinutes / logs.length) : 0}m
            </div>
            <p className="text-xs text-muted-foreground">
              Per practice session
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New Log */}
      <Card>
        <CardHeader>
          <CardTitle>Add Practice Session</CardTitle>
          <CardDescription>
            Log a new practice session to track your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newLog.date}
                  onChange={(e) => setNewLog(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes Practiced</Label>
                <Input
                  id="minutes"
                  type="number"
                  min="1"
                  placeholder="30"
                  value={newLog.minutes}
                  onChange={(e) => setNewLog(prev => ({ ...prev, minutes: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newLog.category} 
                onValueChange={(value) => setNewLog(prev => ({ ...prev, category: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select practice category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vocal-technique">Vocal Technique</SelectItem>
                  <SelectItem value="repertoire">Repertoire</SelectItem>
                  <SelectItem value="sight-reading">Sight Reading</SelectItem>
                  <SelectItem value="performance-prep">Performance Preparation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Notes (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What did you work on during this practice session?"
                value={newLog.description}
                onChange={(e) => setNewLog(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Practice Log
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Practice History */}
      <Card>
        <CardHeader>
          <CardTitle>Practice History</CardTitle>
          <CardDescription>
            Your recent practice sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No practice logs yet. Add your first session above!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{log.date}</span>
                      <Badge variant="secondary">{log.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{log.minutes_practiced} minutes</span>
                    </div>
                    {log.description && (
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
