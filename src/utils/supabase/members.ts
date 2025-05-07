
import { supabase } from '@/integrations/supabase/client';
import { User } from "@/hooks/useUserManagement";
import { Profile, UserRole, MemberStatus, VoicePart } from '@/contexts/AuthContext';
import { MemberNote } from './types';

/**
 * Fetch all members
 */
export async function fetchMembers(): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('last_name');
    
    if (error) throw error;
    
    console.log("fetchMembers raw data:", data); // Debug log
    
    // Transform data to match Profile interface
    const profiles = (data || []).map(member => ({
      ...member,
      role: member.role as UserRole,
      status: member.status as MemberStatus,
      voice_part: member.voice_part as VoicePart | null
    }));
    
    console.log("fetchMembers transformed profiles:", profiles); // Debug log
    
    return profiles;
  } catch (error) {
    console.error('Error fetching members:', error);
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
