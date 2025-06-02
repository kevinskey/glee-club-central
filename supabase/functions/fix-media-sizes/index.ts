
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all media files with null or missing sizes
    const { data: mediaFiles, error: fetchError } = await supabase
      .from('media_library')
      .select('id, file_path, file_url, title')
      .or('size.is.null,size.eq.0');
      
    if (fetchError) {
      throw new Error(`Failed to fetch media files: ${fetchError.message}`);
    }
    
    console.log(`Found ${mediaFiles?.length || 0} files with missing sizes`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each file
    for (const file of mediaFiles || []) {
      try {
        // Try to get file info from storage
        const { data: fileInfo, error: fileError } = await supabase.storage
          .from('media-library')
          .list(file.file_path.split('/').slice(0, -1).join('/'), {
            search: file.file_path.split('/').pop()
          });
          
        if (fileError || !fileInfo || fileInfo.length === 0) {
          console.log(`Could not get file info for ${file.title}: ${fileError?.message || 'File not found'}`);
          errorCount++;
          continue;
        }
        
        const fileSize = fileInfo[0]?.metadata?.size || 0;
        
        // Update the database record
        const { error: updateError } = await supabase
          .from('media_library')
          .update({ size: fileSize })
          .eq('id', file.id);
          
        if (updateError) {
          console.log(`Failed to update size for ${file.title}: ${updateError.message}`);
          errorCount++;
        } else {
          console.log(`Updated size for ${file.title}: ${fileSize} bytes`);
          updatedCount++;
        }
        
      } catch (error) {
        console.log(`Error processing ${file.title}: ${error.message}`);
        errorCount++;
      }
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Updated ${updatedCount} files, ${errorCount} errors`,
        updatedCount,
        errorCount
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
    
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      }
    );
  }
});
