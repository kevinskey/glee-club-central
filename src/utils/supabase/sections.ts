
import { supabase } from '@/integrations/supabase/client';
import { Section } from './types';

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
