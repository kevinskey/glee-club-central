
import { supabase } from '@/integrations/supabase/client';
import { UserTitle, PermissionName } from '@/types/permissions';

export async function fetchUserPermissions(userId: string) {
  try {
    // Fetch user permissions from a view or custom function
    const { data: userPermissions, error: permissionsError } = await supabase
      .rpc('get_user_permissions', { p_user_id: userId });

    if (permissionsError) {
      throw permissionsError;
    }

    // Fetch user title
    const { data: userTitleData, error: titleError } = await supabase
      .from('profiles')
      .select('title')
      .eq('id', userId)
      .single();

    if (titleError) {
      throw titleError;
    }

    const permissions = userPermissions ? userPermissions.map(p => p.permission as PermissionName) : [];
    const rawTitle = userTitleData?.title;
    
    // Updated list of allowed titles to match the type definition
    const allowedTitles: UserTitle[] = [
      "Super Admin",
      "Treasurer",
      "Librarian",
      "Wardrobe Mistress",
      "Secretary",
      "President",
      "Historian",
      "PR Manager",
      "Tour Manager",
      "Stage Manager",
      "Chaplain",
      "Section Leader",
      "Student Worker",
      "General Member",
      "Guest User",
    ];

    // Ensure title is one of the allowed values
    const title = allowedTitles.includes(rawTitle) ? rawTitle as UserTitle : null;

    return { permissions, title };
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
}

export async function updateUserTitle(userId: string, title: UserTitle) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ title })
      .eq('id', userId);

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error updating user title:', error);
    throw error;
  }
}
