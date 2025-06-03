
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function deleteAllHeroSlides() {
  try {
    console.log('🗑️ Deleting all hero slides...');
    
    // Delete all hero slides
    const { error } = await supabase
      .from('hero_slides')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
    
    if (error) throw error;
    
    console.log('🗑️ All hero slides deleted successfully');
    toast.success('All hero slides have been deleted');
    
    return { success: true };
  } catch (error) {
    console.error('🗑️ Error deleting hero slides:', error);
    toast.error('Failed to delete hero slides');
    throw error;
  }
}
