
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord } from './supabase/types';

/**
 * Fetches payment records for a member
 * @param memberId UUID of the member
 * @returns Array of payment records
 */
export const fetchPaymentRecords = async (memberId: string) => {
  try {
    const { data, error } = await supabase
      .from('payment_records')
      .select('*')
      .eq('member_id', memberId)
      .order('payment_date', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payment records:', error);
    return [];
  }
};

/**
 * Fetches user permissions from the database
 * @param userId UUID of the user
 * @returns Object with permission names as keys and boolean values
 */
export const fetchUserPermissions = async (userId: string) => {
  try {
    // Call the stored procedure to get user permissions
    const { data, error } = await supabase
      .rpc('get_user_permissions', { p_user_id: userId });
    
    if (error) throw error;
    
    // Convert array of permission objects to a map
    const permissionsMap: Record<string, boolean> = {};
    if (Array.isArray(data)) {
      data.forEach((item: { permission: string, granted: boolean }) => {
        permissionsMap[item.permission] = item.granted;
      });
    }
    
    return permissionsMap;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return {};
  }
};

/**
 * Fetches attendance records for a member
 * @param memberId UUID of the member
 * @returns Array of attendance records with event details
 */
export const fetchAttendanceRecords = async (memberId: string): Promise<AttendanceRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        id,
        status,
        notes,
        created_at,
        member_id,
        calendar_event_id,
        calendar_events (
          id,
          title,
          date,
          type
        )
      `)
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
};
