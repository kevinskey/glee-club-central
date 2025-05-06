
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/contexts/AuthContext";

// Define types for the data we're working with
export interface Section {
  id: string;
  name: string;
  description?: string | null;
  section_leader_id?: string | null;
  member_count?: number;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  status: string;
  notes?: string;
  calendar_events?: {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
  };
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  status: string;
  description?: string;
}

export interface MemberNote {
  id: string;
  member_id: string;
  note: string;
  created_at: string;
  created_by: string;
  created_by_profile?: {
    first_name?: string;
    last_name?: string;
  };
}

// Helper function to query attendance records safely
export async function fetchAttendanceRecords(memberId: string): Promise<AttendanceRecord[]> {
  try {
    // Use direct query instead of RPC for now
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('member_id', memberId);
    
    if (error) throw error;
    
    // If no data or empty array, return empty array
    if (!data) return [];
    
    // Process and return the data
    return data as AttendanceRecord[];
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
}

// Helper function to query payment records safely
export async function fetchPaymentRecords(memberId: string): Promise<PaymentRecord[]> {
  try {
    // Use direct query instead of RPC
    const { data, error } = await supabase
      .from('payment_records')
      .select('*')
      .eq('member_id', memberId);
    
    if (error) throw error;
    
    // If no data or empty array, return empty array
    if (!data) return [];
    
    // Process and return the data
    return data as PaymentRecord[];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

// Helper function to query member notes safely
export async function fetchMemberNotes(memberId: string): Promise<MemberNote[]> {
  try {
    // Use direct query instead of RPC
    const { data, error } = await supabase
      .from('member_notes')
      .select('*, created_by_profile:profiles(first_name, last_name)')
      .eq('member_id', memberId);
    
    if (error) throw error;
    
    // If no data or empty array, return empty array
    if (!data) return [];
    
    // Process and return the data
    return data as MemberNote[];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

// Helper function to fetch sections
export async function fetchSections(): Promise<Section[]> {
  try {
    // Use direct query instead of RPC
    const { data, error } = await supabase
      .from('sections')
      .select('*');
    
    if (error) throw error;
    
    // Process and return the data
    return data as Section[] || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

// Helper function to fetch section data with member count
export async function fetchSectionsWithMemberCount(): Promise<Section[]> {
  try {
    // Use direct query instead of RPC
    const { data, error } = await supabase
      .from('sections')
      .select('*, profiles:profiles(id)')
      .then((result) => {
        if (result.error) throw result.error;
        
        // Transform data to include member count
        const sections = result.data?.map(section => ({
          ...section,
          member_count: section.profiles ? section.profiles.length : 0
        })) || [];
        
        // Remove the profiles array 
        return { data: sections.map(({ profiles, ...rest }) => rest), error: null };
      });
    
    if (error) throw error;
    
    // Process and return the data
    return data as Section[] || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

// Helper function to fetch members with section data
export async function fetchMembers(): Promise<Profile[]> {
  try {
    // Use direct query instead of RPC
    const { data, error } = await supabase
      .from('profiles')
      .select('*, sections:sections(name)')
      .eq('role', 'member');
    
    if (error) throw error;
    
    // Make sure to cast the data to ensure it has all required Profile properties
    const members = data ? (data as any[]).map((member) => {
      return {
        ...member,
        email: member.email || null,
        phone: member.phone || null,
        role: member.role || 'member',
        voice_part: member.voice_part || null,
        avatar_url: member.avatar_url || null,
        status: member.status || 'pending',
        section_id: member.section_id || null,
        join_date: member.join_date || null
      } as Profile;
    }) : [];
    
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

// New function to fetch all users using the new database function
export async function fetchAllUsers(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_all_users');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

// New function to fetch user by ID using the new database function
export async function fetchUserById(userId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_user_by_id', { p_user_id: userId });
    
    if (error) throw error;
    
    if (data && Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// New function to update user role
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('handle_user_role', { 
        p_user_id: userId,
        p_role: role
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
}

// New function to update user status
export async function updateUserStatus(userId: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .rpc('update_user_status', { 
        p_user_id: userId,
        p_status: status
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating user status:", error);
    return false;
  }
}
