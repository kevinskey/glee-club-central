
import { supabase } from "@/integrations/supabase/client";

// Helper function to query attendance records safely
export async function fetchAttendanceRecords(memberId: string) {
  try {
    // Use raw query to avoid TypeScript errors with untyped tables
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        *,
        calendar_events (title, date, time, location)
      `)
      .eq('member_id', memberId)
      .order('created_at', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
}

// Helper function to query payment records safely
export async function fetchPaymentRecords(memberId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select("*")
      .eq('member_id', memberId)
      .order('payment_date', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    return [];
  }
}

// Helper function to query member notes safely
export async function fetchMemberNotes(memberId: string) {
  try {
    const { data, error } = await supabase
      .from('member_notes')
      .select(`
        *,
        created_by_profile:profiles!created_by (first_name, last_name)
      `)
      .eq('member_id', memberId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}

// Helper function to fetch sections
export async function fetchSections() {
  try {
    const { data, error } = await supabase
      .from('sections')
      .select("id, name");
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

// Helper function to fetch section data with member count
export async function fetchSectionsWithMemberCount() {
  try {
    const { data, error } = await supabase
      .from('sections')
      .select(`
        id,
        name,
        description,
        section_leader_id,
        profiles!section_id (id)
      `);

    if (error) throw error;
    
    // Count members in each section
    const sectionsWithCount = data.map(section => ({
      id: section.id,
      name: section.name,
      description: section.description,
      section_leader_id: section.section_leader_id,
      member_count: section.profiles ? section.profiles.length : 0,
    }));

    return sectionsWithCount;
  } catch (error) {
    console.error("Error fetching sections:", error);
    return [];
  }
}

// Helper function to fetch members with section data
export async function fetchMembers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id, 
        first_name, 
        last_name, 
        email, 
        phone,
        voice_part,
        avatar_url,
        role,
        status,
        section_id,
        join_date,
        sections:section_id (id, name)
      `);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}
