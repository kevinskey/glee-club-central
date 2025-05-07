
import { supabase } from '@/integrations/supabase/client';
import { AttendanceRecord } from './types';

/**
 * Fetch attendance records for a member
 */
export async function fetchAttendanceRecords(memberId: string): Promise<AttendanceRecord[]> {
  try {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*, calendar_events(id, title, date, time)')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Cast status to the correct type
    const typedRecords: AttendanceRecord[] = (data || []).map(record => ({
      ...record,
      status: record.status as 'present' | 'absent' | 'late' | 'excused'
    }));
    
    return typedRecords;
  } catch (error) {
    console.error(`Error fetching attendance records for member ${memberId}:`, error);
    return [];
  }
}
