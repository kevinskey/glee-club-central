
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MediaMigrationResult {
  success: boolean;
  migratedCount: number;
  updatedSlides: number;
  errors: string[];
  idMapping: Record<string, string>;
}

export async function migrateMediaIds(): Promise<MediaMigrationResult> {
  const result: MediaMigrationResult = {
    success: false,
    migratedCount: 0,
    updatedSlides: 0,
    errors: [],
    idMapping: {}
  };

  try {
    console.log('🔄 Starting media ID migration...');

    // Step 1: Get all existing media files
    const { data: mediaFiles, error: fetchError } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: true });

    if (fetchError) {
      result.errors.push(`Error fetching media: ${fetchError.message}`);
      return result;
    }

    if (!mediaFiles || mediaFiles.length === 0) {
      console.log('🔄 No media files found to migrate');
      result.success = true;
      return result;
    }

    console.log(`🔄 Found ${mediaFiles.length} media files to migrate`);

    // Step 2: Create new IDs and update media files
    for (let i = 0; i < mediaFiles.length; i++) {
      const oldFile = mediaFiles[i];
      const oldId = oldFile.id;
      
      // Generate proper UUID for new ID
      let newId: string;
      
      // Use crypto.randomUUID() directly for reliable UUID generation
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        newId = crypto.randomUUID();
      } else {
        // Fallback: generate a simple UUID format
        newId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      
      console.log(`🔄 Migrating media ${i + 1}/${mediaFiles.length}: ${oldFile.title}`);
      console.log(`   Old ID: ${oldId} -> New ID: ${newId}`);

      // Create new media record with new UUID
      const { error: insertError } = await supabase
        .from('media_library')
        .insert({
          id: newId,
          title: oldFile.title,
          description: oldFile.description,
          file_path: oldFile.file_path,
          file_url: oldFile.file_url,
          file_type: oldFile.file_type,
          uploaded_by: oldFile.uploaded_by,
          folder: oldFile.folder,
          tags: oldFile.tags,
          size: oldFile.size,
          is_public: oldFile.is_public,
          is_hero: oldFile.is_hero,
          hero_tag: oldFile.hero_tag,
          display_order: i + 1, // Use index as display order
          created_at: oldFile.created_at
        });

      if (insertError) {
        console.error(`❌ Error inserting new media record: ${insertError.message}`);
        result.errors.push(`Error migrating ${oldFile.title}: ${insertError.message}`);
        continue;
      }

      // Store the mapping
      result.idMapping[oldId] = newId;
      result.migratedCount++;

      // Delete old record
      const { error: deleteError } = await supabase
        .from('media_library')
        .delete()
        .eq('id', oldId);

      if (deleteError) {
        console.warn(`⚠️ Warning: Could not delete old media record ${oldId}: ${deleteError.message}`);
        result.errors.push(`Warning: Could not clean up old record for ${oldFile.title}`);
      }
    }

    console.log(`✅ Migrated ${result.migratedCount} media files`);

    // Step 3: Clean up and update hero slides with new media IDs
    console.log('🔄 Cleaning up slides with invalid media_id values...');
    
    // Clean up slides with various invalid UUID formats
    const invalidFormats = ['null', 'undefined', ''];
    
    for (const invalidFormat of invalidFormats) {
      const { error: cleanupError } = await supabase
        .from('hero_slides')
        .update({ media_id: null })
        .eq('media_id', invalidFormat);

      if (cleanupError) {
        console.warn(`⚠️ Warning cleaning up '${invalidFormat}' media_id values: ${cleanupError.message}`);
      }
    }

    // Also clean up slides with media_id that don't match UUID pattern (like "media-xxx-timestamp")
    const { data: allSlides, error: allSlidesError } = await supabase
      .from('hero_slides')
      .select('id, media_id')
      .not('media_id', 'is', null);

    if (allSlidesError) {
      console.warn(`⚠️ Warning fetching slides for UUID validation: ${allSlidesError.message}`);
    } else if (allSlides) {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      for (const slide of allSlides) {
        if (slide.media_id && !uuidPattern.test(slide.media_id)) {
          console.log(`🔄 Cleaning invalid UUID format: ${slide.media_id}`);
          
          const { error: cleanInvalidError } = await supabase
            .from('hero_slides')
            .update({ media_id: null })
            .eq('id', slide.id);

          if (cleanInvalidError) {
            console.warn(`⚠️ Warning cleaning invalid UUID ${slide.media_id}: ${cleanInvalidError.message}`);
          }
        }
      }
    }

    // Now get slides that have valid media_id references (should be UUIDs only)
    const { data: heroSlides, error: slidesError } = await supabase
      .from('hero_slides')
      .select('*')
      .not('media_id', 'is', null);

    if (slidesError) {
      result.errors.push(`Error fetching hero slides: ${slidesError.message}`);
    } else if (heroSlides && heroSlides.length > 0) {
      console.log(`🔄 Updating ${heroSlides.length} hero slides...`);

      for (const slide of heroSlides) {
        const oldMediaId = slide.media_id;
        const newMediaId = result.idMapping[oldMediaId];

        if (newMediaId) {
          console.log(`🔄 Updating slide "${slide.title}": ${oldMediaId} -> ${newMediaId}`);
          
          const { error: updateError } = await supabase
            .from('hero_slides')
            .update({ media_id: newMediaId })
            .eq('id', slide.id);

          if (updateError) {
            console.error(`❌ Error updating slide: ${updateError.message}`);
            result.errors.push(`Error updating slide ${slide.title}: ${updateError.message}`);
          } else {
            result.updatedSlides++;
          }
        } else {
          console.log(`⚠️ No new media ID found for slide "${slide.title}" (old ID: ${oldMediaId})`);
          
          // Clear the broken reference
          const { error: clearError } = await supabase
            .from('hero_slides')
            .update({ media_id: null })
            .eq('id', slide.id);

          if (clearError) {
            console.error(`❌ Error clearing broken media reference: ${clearError.message}`);
          } else {
            console.log(`✅ Cleared broken media reference for slide "${slide.title}"`);
          }
        }
      }
    }

    console.log(`✅ Updated ${result.updatedSlides} hero slides`);
    result.success = true;

    return result;

  } catch (error) {
    console.error('❌ Media migration failed:', error);
    result.errors.push(`Migration failed: ${error.message || 'Unknown error'}`);
    return result;
  }
}

export async function getMediaMigrationReport(): Promise<{
  totalMedia: number;
  indexedMedia: number;
  brokenSlideReferences: number;
  validSlideReferences: number;
}> {
  try {
    // Get media count
    const { count: totalMedia } = await supabase
      .from('media_library')
      .select('*', { count: 'exact' });

    // Get indexed media (those with new ID format)
    const { count: indexedMedia } = await supabase
      .from('media_library')
      .select('*', { count: 'exact' })
      .like('id', 'media-%');

    // Get hero slides with media references
    const { data: slidesWithMedia } = await supabase
      .from('hero_slides')
      .select('id, media_id')
      .neq('media_id', null);

    let brokenSlideReferences = 0;
    let validSlideReferences = 0;

    if (slidesWithMedia) {
      for (const slide of slidesWithMedia) {
        const { count } = await supabase
          .from('media_library')
          .select('*', { count: 'exact' })
          .eq('id', slide.media_id);

        if (count && count > 0) {
          validSlideReferences++;
        } else {
          brokenSlideReferences++;
        }
      }
    }

    return {
      totalMedia: totalMedia || 0,
      indexedMedia: indexedMedia || 0,
      brokenSlideReferences,
      validSlideReferences
    };

  } catch (error) {
    console.error('Error generating migration report:', error);
    return {
      totalMedia: 0,
      indexedMedia: 0,
      brokenSlideReferences: 0,
      validSlideReferences: 0
    };
  }
}
