
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { CheckCircle, DollarSign, Download } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface DuesRecord {
  id: string;
  member_id: string;
  amount_paid: number;
  amount_owed: number;
  date_paid: string | null;
  notes: string | null;
  member_name: string;
}

export function DuesTracker() {
  const [dues, setDues] = useState<DuesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    amount_paid: '',
    amount_owed: '',
    notes: '',
    date_paid: ''
  });

  useEffect(() => {
    fetchDues();
  }, []);

  const fetchDues = async () => {
    try {
      const { data, error } = await supabase
        .from('dues')
        .select(`
          *,
          profiles!dues_member_id_fkey (first_name, last_name)
        `)
        .order('profiles(last_name)', { ascending: true });

      if (error) throw error;

      const formattedDues = data?.map(record => ({
        id: record.id,
        member_id: record.member_id,
        amount_paid: record.amount_paid,
        amount_owed: record.amount_owed,
        date_paid: record.date_paid,
        notes: record.notes,
        member_name: `${record.profiles?.first_name || ''} ${record.profiles?.last_name || ''}`.trim() || 'Unknown Member'
      })) || [];

      setDues(formattedDues);
    } catch (error) {
      console.error('Error fetching dues:', error);
      toast.error('Failed to load dues records');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: DuesRecord) => {
    setEditingId(record.id);
    setEditForm({
      amount_paid: record.amount_paid.toString(),
      amount_owed: record.amount_owed.toString(),
      notes: record.notes || '',
      date_paid: record.date_paid || ''
    });
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('dues')
        .update({
          amount_paid: parseFloat(editForm.amount_paid) || 0,
          amount_owed: parseFloat(editForm.amount_owed) || 0,
          notes: editForm.notes || null,
          date_paid: editForm.date_paid || null
        })
        .eq('id', id);

      if (error) throw error;

      setEditingId(null);
      fetchDues();
      toast.success('Dues record updated successfully');
    } catch (error) {
      console.error('Error updating dues:', error);
      toast.error('Failed to update dues record');
    }
  };

  const markAsPaid = async (id: string, amountOwed: number) => {
    try {
      const { error } = await supabase
        .from('dues')
        .update({
          amount_paid: amountOwed,
          date_paid: new Date().toISOString().split('T')[0]
        })
        .eq('id', id);

      if (error) throw error;

      fetchDues();
      toast.success('Dues marked as paid');
    } catch (error) {
      console.error('Error marking dues as paid:', error);
      toast.error('Failed to mark dues as paid');
    }
  };

  const exportCSV = () => {
    const csvContent = [
      ['Name', 'Amount Paid', 'Amount Owed', 'Date Paid', 'Notes'],
      ...dues.map(record => [
        record.member_name,
        record.amount_paid.toString(),
        record.amount_owed.toString(),
        record.date_paid || '',
        record.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dues-tracker-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalPaid = dues.reduce((sum, record) => sum + record.amount_paid, 0);
  const totalOwed = dues.reduce((sum, record) => sum + record.amount_owed, 0);
  const totalOutstanding = dues.reduce((sum, record) => sum + (record.amount_owed - record.amount_paid), 0);

  if (loading) {
    return <div className="text-center py-8">Loading dues records...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOwed.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOutstanding.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={exportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Dues Table */}
      <Card>
        <CardHeader>
          <CardTitle>Member Dues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Amount Owed</TableHead>
                <TableHead>Date Paid</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dues.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.member_name}
                    {record.amount_paid >= record.amount_owed && (
                      <Badge variant="default" className="ml-2">Paid</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.amount_paid}
                        onChange={(e) => setEditForm(prev => ({ ...prev, amount_paid: e.target.value }))}
                        className="w-24"
                      />
                    ) : (
                      `$${record.amount_paid.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editForm.amount_owed}
                        onChange={(e) => setEditForm(prev => ({ ...prev, amount_owed: e.target.value }))}
                        className="w-24"
                      />
                    ) : (
                      `$${record.amount_owed.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Input
                        type="date"
                        value={editForm.date_paid}
                        onChange={(e) => setEditForm(prev => ({ ...prev, date_paid: e.target.value }))}
                      />
                    ) : (
                      record.date_paid ? format(new Date(record.date_paid), 'MMM dd, yyyy') : 'Not paid'
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <Textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                        className="min-h-[60px]"
                      />
                    ) : (
                      record.notes || '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingId === record.id ? (
                        <>
                          <Button size="sm" onClick={() => handleSave(record.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                            Edit
                          </Button>
                          {record.amount_paid < record.amount_owed && (
                            <Button 
                              size="sm" 
                              onClick={() => markAsPaid(record.id, record.amount_owed)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                        </>
                      )}
                    </div>
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
