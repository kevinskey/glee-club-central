
import { supabase } from '@/integrations/supabase/client';
import { PaymentRecord } from './types';

/**
 * Fetch payment records for a member
 */
export async function fetchPaymentRecords(memberId: string): Promise<PaymentRecord[]> {
  try {
    const { data, error } = await supabase
      .from('payment_records')
      .select('*')
      .eq('member_id', memberId)
      .order('payment_date', { ascending: false });
    
    if (error) throw error;
    
    // Cast status to the correct type
    const typedRecords: PaymentRecord[] = (data || []).map(record => ({
      ...record,
      status: record.status as 'pending' | 'completed' | 'failed'
    }));
    
    return typedRecords;
  } catch (error) {
    console.error(`Error fetching payment records for member ${memberId}:`, error);
    return [];
  }
}
