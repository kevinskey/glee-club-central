
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
    // Use direct RPC query
    const { data, error } = await supabase.rpc('get_attendance_records', { 
      p_member_id: memberId 
    });
    
    if (error) throw error;
    
    // If no data or empty array, return empty array
    if (!data) return [];
    
    // Process and return the data
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
}

// Helper function to query payment records safely
export async function fetchPaymentRecords(memberId: string): Promise<PaymentRecord[]> {
  try {
    // Use direct RPC query
    const { data, error } = await supabase.rpc('get_payment_records', { 
      p_member_id: memberId 
    });
    
    if (error) throw error;
    
    // If no data or empty array, return empty array
    if (!data) return [];
    
    // Process and return the data
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

// Helper function to query member notes safely
export async function fetchMemberNotes(memberId: string): Promise<MemberNote[]> {
  try {
    // Use direct RPC query
    const { data, error } = await supabase.rpc('get_member_notes', { 
      p_member_id: memberId 
    });
    
    if (error) throw error;
    
    // If no data or empty array, return empty array
    if (!data) return [];
    
    // Process and return the data
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

// Helper function to fetch sections
export async function fetchSections(): Promise<Section[]> {
  try {
    // Use RPC query
    const { data, error } = await supabase.rpc('get_sections');
    
    if (error) throw error;
    
    // Process and return the data
    return data || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

// Helper function to fetch section data with member count
export async function fetchSectionsWithMemberCount(): Promise<Section[]> {
  try {
    const { data, error } = await supabase.rpc('get_sections_with_member_count');
    
    if (error) throw error;
    
    // Process and return the data
    return data || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

// Helper function to fetch members with section data
export async function fetchMembers(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase.rpc('get_members_with_sections');
    
    if (error) throw error;
    
    // Make sure to cast the data to ensure it has all required Profile properties
    const members = (data || []).map(member => {
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
    });
    
    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}
