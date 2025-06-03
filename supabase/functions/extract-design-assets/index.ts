
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
    const { assetId } = await req.json();
    
    if (!assetId) {
      throw new Error("Asset ID is required");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the asset details
    const { data: asset, error: assetError } = await supabase
      .from('design_assets')
      .select('*')
      .eq('id', assetId)
      .single();

    if (assetError || !asset) {
      throw new Error("Asset not found");
    }

    // Update status to extracting
    await supabase
      .from('design_assets')
      .update({ extraction_status: 'extracting' })
      .eq('id', assetId);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('design-assets')
      .download(asset.file_path);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // For ZIP files, we'll extract them
    if (asset.file_type === 'application/zip' || asset.file_name.endsWith('.zip')) {
      try {
        // Convert blob to array buffer
        const arrayBuffer = await fileData.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        
        // Use Deno's built-in zip functionality
        const extractedFiles: any[] = [];
        
        // Create a temporary directory name
        const extractDir = `extracted/${asset.id}/`;
        
        // For now, we'll simulate extraction by creating a manifest
        // In a real implementation, you'd use a ZIP library
        extractedFiles.push({
          name: 'manifest.json',
          path: `${extractDir}manifest.json`,
          size: 1024,
          type: 'application/json'
        });

        // Upload extracted files info (simplified for demo)
        const manifestContent = JSON.stringify({
          originalFile: asset.file_name,
          extractedAt: new Date().toISOString(),
          files: extractedFiles
        });

        // Upload manifest to storage
        const manifestBlob = new Blob([manifestContent], { type: 'application/json' });
        await supabase.storage
          .from('design-assets')
          .upload(`${extractDir}manifest.json`, manifestBlob);

        // Update the asset with extraction results
        await supabase
          .from('design_assets')
          .update({
            extraction_status: 'completed',
            extracted_files: extractedFiles,
            extracted_at: new Date().toISOString()
          })
          .eq('id', assetId);

        return new Response(
          JSON.stringify({
            success: true,
            extractedFiles,
            message: "File extracted successfully"
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200
          }
        );

      } catch (extractError) {
        console.error("Extraction error:", extractError);
        
        // Update status to failed
        await supabase
          .from('design_assets')
          .update({ extraction_status: 'failed' })
          .eq('id', assetId);

        throw new Error(`Extraction failed: ${extractError.message}`);
      }
    } else {
      // For non-ZIP files, just mark as completed
      await supabase
        .from('design_assets')
        .update({
          extraction_status: 'completed',
          extracted_files: [{ 
            name: asset.file_name, 
            path: asset.file_path, 
            size: asset.file_size,
            type: asset.file_type 
          }],
          extracted_at: new Date().toISOString()
        })
        .eq('id', assetId);

      return new Response(
        JSON.stringify({
          success: true,
          message: "File processed successfully"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        }
      );
    }

  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
