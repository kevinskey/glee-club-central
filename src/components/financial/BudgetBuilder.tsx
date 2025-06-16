
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Save, Trash2, Copy, Calculator } from 'lucide-react';
import { useFinancialBudgets } from '@/hooks/useFinancialBudgets';
import { toast } from 'sonner';

export const BudgetBuilder: React.FC = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, loading } = useFinancialBudgets();
  const [editingBudget, setEditingBudget] = useState<any>(null);
  const [newBudget, setNewBudget] = useState({
    category: '',
    budgeted_amount: '',
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    semester: '',
    notes: '',
  });

  const categories = [
    'Performance',
    'Travel',
    'Equipment',
    'Uniforms',
    'Music & Sheet Music',
    'Marketing',
    'Events',
    'Administrative',
    'Emergency Fund',
    'Other'
  ];

  const semesters = ['Fall', 'Spring', 'Summer', 'Full Year'];

  const handleAddBudget = async () => {
    if (!newBudget.category || !newBudget.budgeted_amount) {
      toast.error('Please fill in category and amount');
      return;
    }

    try {
      await addBudget({
        ...newBudget,
        budgeted_amount: parseFloat(newBudget.budgeted_amount),
      });
      
      setNewBudget({
        category: '',
        budgeted_amount: '',
        academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        semester: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleUpdateBudget = async () => {
    if (!editingBudget) return;

    try {
      await updateBudget(editingBudget.id, {
        ...editingBudget,
        budgeted_amount: parseFloat(editingBudget.budgeted_amount),
      });
      setEditingBudget(null);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await deleteBudget(id);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const duplicateBudget = (budget: any) => {
    setNewBudget({
      category: budget.category + ' (Copy)',
      budgeted_amount: budget.budgeted_amount.toString(),
      academic_year: budget.academic_year,
      semester: budget.semester || '',
      notes: budget.notes || '',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + Number(budget.budgeted_amount), 0);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0072CE] mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300">Loading budget builder...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[#0072CE]" />
            Budget Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Budget Categories</p>
              <p className="text-2xl font-bold text-[#0072CE]">{budgets.length}</p>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Total Budgeted Amount</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(getTotalBudget())}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Academic Year</p>
              <p className="text-lg font-semibold text-black dark:text-white">{newBudget.academic_year}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#0072CE]" />
            Create New Budget Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium text-black dark:text-white">Category</Label>
              <Select
                value={newBudget.category}
                onValueChange={(value) => setNewBudget({ ...newBudget, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium text-black dark:text-white">Budgeted Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newBudget.budgeted_amount}
                onChange={(e) => setNewBudget({ ...newBudget, budgeted_amount: e.target.value })}
                className="border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester" className="text-sm font-medium text-black dark:text-white">Semester</Label>
              <Select
                value={newBudget.semester}
                onValueChange={(value) => setNewBudget({ ...newBudget, semester: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((sem) => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year" className="text-sm font-medium text-black dark:text-white">Academic Year</Label>
              <Input
                id="academic_year"
                value={newBudget.academic_year}
                onChange={(e) => setNewBudget({ ...newBudget, academic_year: e.target.value })}
                placeholder="2024-2025"
                className="border-gray-300 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes" className="text-sm font-medium text-black dark:text-white">Notes</Label>
              <Textarea
                id="notes"
                value={newBudget.notes}
                onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
                placeholder="Additional notes about this budget category..."
                rows={3}
                className="border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleAddBudget}>
              <Plus className="mr-2 h-4 w-4" />
              Add Budget Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-black dark:text-white">Budget Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-700 dark:text-gray-300">No budget categories created yet.</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Create your first budget category above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {budgets.map((budget) => (
                <div key={budget.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  {editingBudget?.id === budget.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-black dark:text-white">Category</Label>
                          <Select
                            value={editingBudget.category}
                            onValueChange={(value) => setEditingBudget({ ...editingBudget, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-black dark:text-white">Amount</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingBudget.budgeted_amount}
                            onChange={(e) => setEditingBudget({ ...editingBudget, budgeted_amount: e.target.value })}
                            className="border-gray-300 dark:border-gray-600"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button onClick={handleUpdateBudget} size="sm">
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingBudget(null)} size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-black dark:text-white">{budget.category}</h3>
                          <Badge variant="outline" className="border-[#0072CE] text-[#0072CE]">
                            {budget.semester || 'Full Year'}
                          </Badge>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {budget.academic_year}
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-[#0072CE] mb-2">
                          {formatCurrency(budget.budgeted_amount)}
                        </p>
                        {budget.notes && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">{budget.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => duplicateBudget(budget)}
                          className="border-[#0072CE] text-[#0072CE] hover:bg-[#0072CE]/10"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBudget({ ...budget, budgeted_amount: budget.budgeted_amount.toString() })}
                          className="border-[#0072CE] text-[#0072CE] hover:bg-[#0072CE]/10"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
