
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Upload, Download, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface BudgetEntry {
  id: string;
  category: string;
  amount: number;
  purpose: string;
  receipt_url: string | null;
  created_at: string;
  uploaded_by: string;
}

const BUDGET_CATEGORIES = [
  'Transportation',
  'Meals',
  'Uniforms',
  'Sheet Music',
  'Equipment',
  'Venue Rental',
  'Marketing',
  'Administrative',
  'Emergency Fund',
  'Other'
];

export function BudgetOverview() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    purpose: '',
    receipt_file: null as File | null
  });

  useEffect(() => {
    fetchBudgetEntries();
  }, []);

  const fetchBudgetEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching budget entries:', error);
      toast.error('Failed to load budget entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.category || !form.amount || !form.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let receipt_url = null;

      // Upload receipt if provided
      if (form.receipt_file) {
        const fileExt = form.receipt_file.name.split('.').pop();
        const fileName = `receipt-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, form.receipt_file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('receipts')
          .getPublicUrl(fileName);
        
        receipt_url = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('budget_entries')
        .insert({
          category: form.category,
          amount: parseFloat(form.amount),
          purpose: form.purpose,
          receipt_url,
          uploaded_by: user?.id
        });

      if (error) throw error;

      setForm({ category: '', amount: '', purpose: '', receipt_file: null });
      setShowForm(false);
      fetchBudgetEntries();
      toast.success('Budget entry added successfully');
    } catch (error) {
      console.error('Error adding budget entry:', error);
      toast.error('Failed to add budget entry');
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Category', 'Amount', 'Purpose', 'Date', 'Receipt'],
      ...entries.map(entry => [
        entry.category,
        entry.amount.toString(),
        entry.purpose,
        format(new Date(entry.created_at), 'yyyy-MM-dd'),
        entry.receipt_url ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-entries-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate totals by category
  const categoryTotals = entries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const budgetLimit = 5000; // This could be configurable
  const isOverBudget = totalSpent > budgetLimit;

  if (loading) {
    return <div className="text-center py-8">Loading budget entries...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Budget Alert */}
      {isOverBudget && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: Total expenses (${totalSpent.toFixed(2)}) exceed the budget limit (${budgetLimit.toFixed(2)}).
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
              ${totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetLimit.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              ${(budgetLimit - totalSpent).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Add Entry Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Budget Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select value={form.category} onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
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
                <label className="text-sm font-medium">Purpose *</label>
                <Textarea
                  value={form.purpose}
                  onChange={(e) => setForm(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="What was this expense for?"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Receipt (PDF or Image)</label>
                <Input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setForm(prev => ({ ...prev, receipt_file: e.target.files?.[0] || null }))}
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

      {/* Budget Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(new Date(entry.created_at), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{entry.category}</TableCell>
                  <TableCell>${entry.amount.toFixed(2)}</TableCell>
                  <TableCell>{entry.purpose}</TableCell>
                  <TableCell>
                    {entry.receipt_url ? (
                      <Button variant="outline" size="sm" asChild>
                        <a href={entry.receipt_url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    ) : (
                      'No receipt'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
