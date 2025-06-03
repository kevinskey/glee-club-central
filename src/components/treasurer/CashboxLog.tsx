
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface CashLogEntry {
  id: string;
  action: 'add' | 'remove';
  amount: number;
  notes: string | null;
  timestamp: string;
  logged_by: string;
}

export function CashboxLog() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<CashLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    action: '' as 'add' | 'remove' | '',
    amount: '',
    notes: ''
  });

  useEffect(() => {
    fetchCashLog();
  }, []);

  const fetchCashLog = async () => {
    try {
      const { data, error } = await supabase
        .from('cash_log')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching cash log:', error);
      toast.error('Failed to load cash log');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.action || !form.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('cash_log')
        .insert({
          action: form.action,
          amount: parseFloat(form.amount),
          notes: form.notes || null,
          logged_by: user?.id
        });

      if (error) throw error;

      setForm({ action: '', amount: '', notes: '' });
      setShowForm(false);
      fetchCashLog();
      toast.success('Cash log entry added successfully');
    } catch (error) {
      console.error('Error adding cash log entry:', error);
      toast.error('Failed to add cash log entry');
    }
  };

  // Calculate current balance
  const currentBalance = entries.reduce((balance, entry) => {
    return entry.action === 'add' 
      ? balance + entry.amount 
      : balance - entry.amount;
  }, 0);

  const totalAdded = entries
    .filter(entry => entry.action === 'add')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalRemoved = entries
    .filter(entry => entry.action === 'remove')
    .reduce((sum, entry) => sum + entry.amount, 0);

  if (loading) {
    return <div className="text-center py-8">Loading cash log...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(currentBalance).toFixed(2)}
              {currentBalance < 0 && <span className="text-sm ml-1">(deficit)</span>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalAdded.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Removed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalRemoved.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Entry Button */}
      <div className="flex justify-start">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Cash Entry
        </Button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Cash Log Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Action *</label>
                  <Select value={form.action} onValueChange={(value: 'add' | 'remove') => setForm(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Cash</SelectItem>
                      <SelectItem value="remove">Remove Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount *</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes about this cash transaction..."
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Entry</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Cash Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Log History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Running Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => {
                // Calculate running balance at this point in time
                const runningBalance = entries
                  .slice(index)
                  .reduce((balance, e) => {
                    return e.action === 'add' 
                      ? balance + e.amount 
                      : balance - e.amount;
                  }, 0);

                return (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                    <TableCell>
                      <Badge variant={entry.action === 'add' ? 'default' : 'destructive'} className="flex items-center gap-1 w-fit">
                        {entry.action === 'add' ? (
                          <>
                            <TrendingUp className="h-3 w-3" />
                            Add
                          </>
                        ) : (
                          <>
                            <TrendingDown className="h-3 w-3" />
                            Remove
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className={entry.action === 'add' ? 'text-green-600' : 'text-red-600'}>
                      {entry.action === 'add' ? '+' : '-'}${entry.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{entry.notes || '-'}</TableCell>
                    <TableCell className={runningBalance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${Math.abs(runningBalance).toFixed(2)}
                      {runningBalance < 0 && <span className="text-xs ml-1">(deficit)</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
