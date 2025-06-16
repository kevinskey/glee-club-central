
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FinancialTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  subcategory?: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  payment_method?: string;
  reference_id?: string;
  reference_type?: string;
  member_id?: string;
  notes?: string;
  receipt_url?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  approved_by?: string;
  approved_at?: string;
  status: 'pending' | 'approved' | 'rejected';
  member?: {
    first_name: string;
    last_name: string;
  };
  creator?: {
    first_name: string;
    last_name: string;
  };
}

export const useFinancialTransactions = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          member:member_id(first_name, last_name),
          creator:created_by(first_name, last_name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
      
      // Calculate totals
      const income = data?.filter(t => t.transaction_type === 'income' && t.status === 'approved')
        .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
      const expenses = data?.filter(t => t.transaction_type === 'expense' && t.status === 'approved')
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) || 0;
      
      setTotalIncome(income);
      setTotalExpenses(expenses);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load financial transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Partial<FinancialTransaction>) => {
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([transaction])
        .select()
        .single();

      if (error) throw error;

      toast.success('Transaction added successfully');
      await fetchTransactions();
      return data;
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast.success('Transaction updated successfully');
      await fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
      throw error;
    }
  };

  const approveTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast.success('Transaction approved');
      await fetchTransactions();
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast.error('Failed to approve transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Transaction deleted');
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    addTransaction,
    updateTransaction,
    approveTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
};
