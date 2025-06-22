
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addTransaction } = useFinancialTransactions();
  const { incomeCategories, expenseCategories } = useFinancialCategories();
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    subcategory: '',
    amount: '',
    transaction_type: 'income' as 'income' | 'expense',
    payment_method: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      category: '',
      subcategory: '',
      amount: '',
      transaction_type: 'income',
      payment_method: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.category || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      await addTransaction({
        date: formData.date,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || null,
        amount: formData.transaction_type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        transaction_type: formData.transaction_type,
        payment_method: formData.payment_method || null,
        notes: formData.notes || null,
        reference_type: 'manual',
        status: 'pending',
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = formData.transaction_type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-[90%] md:max-w-[50%] mx-auto">
        <DialogHeader>
          <DialogTitle>Add Financial Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction in the ledger.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Type *</Label>
              <Select 
                value={formData.transaction_type} 
                onValueChange={(value: 'income' | 'expense') => 
                  setFormData({ ...formData, transaction_type: value, category: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the transaction"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name.toLowerCase()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method</Label>
            <Select 
              value={formData.payment_method} 
              onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="venmo">Venmo</SelectItem>
                <SelectItem value="zelle">Zelle</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or details..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-glee-spelman hover:bg-glee-spelman/90"
            >
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
