
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FinancialBudget {
  id: string;
  category: string;
  budgeted_amount: number;
  academic_year: string;
  semester?: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useFinancialBudgets = () => {
  const [budgets, setBudgets] = useState<FinancialBudget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_budgets')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (budget: Partial<FinancialBudget>) => {
    try {
      const { data, error } = await supabase
        .from('financial_budgets')
        .insert([budget])
        .select()
        .single();

      if (error) throw error;

      toast.success('Budget added successfully');
      await fetchBudgets();
      return data;
    } catch (error) {
      console.error('Error adding budget:', error);
      toast.error('Failed to add budget');
      throw error;
    }
  };

  const updateBudget = async (id: string, updates: Partial<FinancialBudget>) => {
    try {
      const { error } = await supabase
        .from('financial_budgets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Budget updated successfully');
      await fetchBudgets();
    } catch (error) {
      console.error('Error updating budget:', error);
      toast.error('Failed to update budget');
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Budget deleted successfully');
      await fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
      throw error;
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets
  };
};
