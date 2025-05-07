
// This edge function will deploy updated SQL functions for user queries

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get Supabase client from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Update the get_all_users function to include new fields
    const { error: updateGetAllUsersError } = await supabase.rpc("update_get_all_users_function");
    
    if (updateGetAllUsersError) {
      console.error("Error updating get_all_users function:", updateGetAllUsersError);
      return new Response(
        JSON.stringify({ error: "Failed to update get_all_users function" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Update the get_user_by_id function to include new fields
    const { error: updateGetUserByIdError } = await supabase.rpc("update_get_user_by_id_function");
    
    if (updateGetUserByIdError) {
      console.error("Error updating get_user_by_id function:", updateGetUserByIdError);
      return new Response(
        JSON.stringify({ error: "Failed to update get_user_by_id function" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({ message: "User query functions updated successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in update-user-queries function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
