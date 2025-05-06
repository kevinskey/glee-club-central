
import { supabase } from '@/integrations/supabase/client';

export interface Section {
  id: string;
  name: string;
  description?: string | null;
  section_leader_id?: string | null;
  section_leader_name?: string | null;
  member_count?: number;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  calendar_event_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string | null;
  created_at: string;
  calendar_events?: {
    id: string;
    title: string;
    date: string;
    time?: string;
  };
}

export interface PaymentRecord {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  description?: string | null;
}

export interface MemberNote {
  id: string;
  member_id: string;
  created_by: string;
  note: string;
  created_at: string;
}

/**
 * Safely fetches sections with member count and section leader name
 * This function uses direct table queries with error handling
 */
export async function fetchSectionsWithMemberCount(): Promise<Section[]> {
  try {
    // Get sections
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .order('name');
    
    if (sectionsError) throw sectionsError;
    if (!sections) return [];
    
    // Get member count for each section
    const sectionsWithCounts = await Promise.all(
      sections.map(async (section: Section) => {
        // Get member count
        const { count: memberCount, error: countError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('section_id', section.id);
        
        if (countError) {
          console.error(`Error getting count for section ${section.id}:`, countError);
          return { ...section, member_count: 0 };
        }
        
        // Get section leader name if there is a leader assigned
        let leaderName: string | null = null;
        if (section.section_leader_id) {
          const { data: leader, error: leaderError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', section.section_leader_id)
            .single();
          
          if (!leaderError && leader) {
            leaderName = `${leader.first_name || ''} ${leader.last_name || ''}`.trim();
          }
        }
        
        // Return section with member count and leader name
        return {
          ...section,
          member_count: memberCount || 0,
          section_leader_name: leaderName
        };
      })
    );
    
    return sectionsWithCounts;
  } catch (error) {
    console.error('Error fetching sections with counts:', error);
    return [];
  }
}

/**
 * Fetch all sections without member count
 */
export async function fetchSections(): Promise<Section[]> {
  try {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
}

/**
 * Fetch all members
 */
export async function fetchMembers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, sections(name)')
      .order('last_name');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

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
    return data || [];
  } catch (error) {
    console.error(`Error fetching attendance records for member ${memberId}:`, error);
    return [];
  }
}

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
    return data || [];
  } catch (error) {
    console.error(`Error fetching payment records for member ${memberId}:`, error);
    return [];
  }
}

/**
 * Fetch notes for a member
 */
export async function fetchMemberNotes(memberId: string): Promise<MemberNote[]> {
  try {
    const { data, error } = await supabase
      .from('member_notes')
      .select('*')
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching notes for member ${memberId}:`, error);
    return [];
  }
}

/**
 * Fetch all users with RLS bypassing function
 */
export async function fetchAllUsers() {
  try {
    const { data, error } = await supabase.rpc('get_all_users');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
}

/**
 * Fetch user by ID with RLS bypassing function
 */
export async function fetchUserById(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_user_by_id', {
      p_user_id: userId
    });
    
    if (error) throw error;
    
    // This RPC returns an array with one item, so we need to return the first item
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return null;
  }
}

/**
 * Update user role through RLS bypassing function
 */
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('handle_user_role', {
      p_user_id: userId,
      p_role: role
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error);
    return false;
  }
}

/**
 * Update user status through RLS bypassing function
 */
export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('update_user_status', {
      p_user_id: userId,
      p_status: status
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
    return false;
  }
}
