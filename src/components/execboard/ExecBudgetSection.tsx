
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Upload, Receipt } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BudgetEntry {
  id: string;
  amount: number;
  category: string;
  purpose: string;
  receipt_url?: string;
  created_at: string;
  uploaded_by: string;
}

export function ExecBudgetSection() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reimbursementDialog, setReimbursementDialog] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'travel',
    purpose: '',
    description: ''
  });
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const categories = [
    { value: 'travel', label: 'Travel' },
    { value: 'uniforms', label: 'Uniforms' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'events', label: 'Events' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'other', label: 'Other' }
  ];

  const canSubmitReimbursement = () => {
    return profile?.is_exec_board === true;
  };

  const canViewBudget = () => {
    return ['President', 'Treasurer', 'Business Manager'].includes(profile?.exec_board_role || '');
  };

  useEffect(() => {
    fetchBudgetEntries();
  }, []);

  const fetchBudgetEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_entries')
        .select(`
          id,
          amount,
          category,
          purpose,
          receipt_url,
          created_at,
          uploaded_by,
          profiles!inner(first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const formattedEntries = data?.map(entry => ({
        id: entry.id,
        amount: entry.amount,
        category: entry.category,
        purpose: entry.purpose,
        receipt_url: entry.receipt_url,
        created_at: entry.created_at,
        uploaded_by: `${entry.profiles?.first_name} ${entry.profiles?.last_name}`
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error fetching budget entries:', error);
      toast.error('Failed to load budget entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReimbursementSubmit = async () => {
    if (!formData.amount || !formData.purpose.trim()) {
      toast.error('Please provide amount and purpose');
      return;
    }

    try {
      let receiptUrl = null;

      if (receiptFile) {
        const fileExt = receiptFile.name.split('.').pop();
        const fileName = `${Date.now()}-receipt.${fileExt}`;
        const filePath = `receipts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, receiptFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);

        receiptUrl = publicUrl;
      }

      const { error } = await supabase
        .from('budget_entries')
        .insert({
          amount: parseFloat(formData.amount),
          category: formData.category,
          purpose: formData.purpose,
          receipt_url: receiptUrl,
          uploaded_by: profile?.id
        });

      if (error) throw error;

      toast.success('Reimbursement request submitted');
      setReimbursementDialog(false);
      setFormData({ amount: '', category: 'travel', purpose: '', description: '' });
      setReceiptFile(null);
      fetchBudgetEntries();
    } catch (error) {
      console.error('Error submitting reimbursement:', error);
      toast.error('Failed to submit reimbursement request');
    }
  };

  const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Budget & Reimbursements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Budget & Reimbursements
        </CardTitle>
        {canSubmitReimbursement() && (
          <Dialog open={reimbursementDialog} onOpenChange={setReimbursementDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Request Reimbursement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Reimbursement Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Purpose</label>
                  <Textarea
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Describe what this expense was for"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Receipt (Optional)</label>
                  <Input
                    type="file"
                    onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                    accept="image/*,.pdf"
                  />
                </div>
                <Button onClick={handleReimbursementSubmit} className="w-full">
                  <Receipt className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {canViewBudget() && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Recent Expenses Total:</span>
              <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No budget entries yet</p>
            {canSubmitReimbursement() && (
              <p className="text-sm">Click "Request Reimbursement" to submit expenses</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">${entry.amount.toFixed(2)}</span>
                    <Badge variant="outline" className="text-xs">
                      {entry.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entry.purpose}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.uploaded_by} • {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
                {entry.receipt_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={entry.receipt_url} target="_blank" rel="noopener noreferrer">
                      <Receipt className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
