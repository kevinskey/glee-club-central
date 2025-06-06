
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    
    // Extract params from form data
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const userId = formData.get("userId") as string;
    const category = formData.get("category") as string;
    const notes = formData.get("notes") as string;
    const filePath = formData.get("filePath") as string;
    
    if (!file || !title || !userId || !filePath) {
      throw new Error("Missing required fields");
    }
    
    // Create client with service role for storage operations
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("audio")
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("audio")
      .getPublicUrl(filePath);
      
    // Save record to database
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from("audio_files")
      .insert({
        title,
        description: notes || null,
        file_url: publicUrlData.publicUrl,
        file_path: filePath,
        uploaded_by: userId,
        category: category || "my_tracks"
      })
      .select()
      .single();
      
    if (dbError) throw dbError;
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: dbData
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
        status: 400
      }
    );
  }
});
