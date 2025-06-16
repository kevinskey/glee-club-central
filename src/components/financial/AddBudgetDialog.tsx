
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
import { useFinancialBudgets } from '@/hooks/useFinancialBudgets';
import { useFinancialCategories } from '@/hooks/useFinancialCategories';
import { toast } from 'sonner';

interface AddBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddBudgetDialog: React.FC<AddBudgetDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { addBudget } = useFinancialBudgets();
  const { expenseCategories } = useFinancialCategories();
  
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 1}`;
  
  const [formData, setFormData] = useState({
    category: '',
    budgeted_amount: '',
    academic_year: academicYear,
    semester: '',
    notes: '',
  });
  
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      category: '',
      budgeted_amount: '',
      academic_year: academicYear,
      semester: '',
      notes: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.budgeted_amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const amount = parseFloat(formData.budgeted_amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid budget amount');
        return;
      }

      await addBudget({
        category: formData.category,
        budgeted_amount: amount,
        academic_year: formData.academic_year,
        semester: formData.semester || null,
        notes: formData.notes || null,
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Budget Category</DialogTitle>
          <DialogDescription>
            Create a new budget category for the current academic year.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name.toLowerCase()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgeted_amount">Budget Amount *</Label>
              <Input
                id="budgeted_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.budgeted_amount}
                onChange={(e) => setFormData({ ...formData, budgeted_amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select 
                value={formData.semester} 
                onValueChange={(value) => setFormData({ ...formData, semester: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall">Fall</SelectItem>
                  <SelectItem value="spring">Spring</SelectItem>
                  <SelectItem value="summer">Summer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academic_year">Academic Year</Label>
            <Input
              id="academic_year"
              value={formData.academic_year}
              onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
              placeholder="2024-2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about this budget..."
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
              {loading ? 'Adding...' : 'Add Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
