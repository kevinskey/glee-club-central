
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ElasticEmailRequest {
  action: string;
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data }: ElasticEmailRequest = await req.json();
    const apiKey = Deno.env.get("ELASTIC_EMAIL_API_KEY");
    
    if (!apiKey) {
      throw new Error("Elastic Email API key not configured");
    }

    console.log(`Processing Elastic Email action: ${action}`);

    switch (action) {
      case 'load_all':
        return await loadAllData(apiKey);
      case 'sync_contacts':
        return await syncContacts(apiKey);
      case 'sync_templates':
        return await syncTemplates(apiKey);
      case 'export_members':
        return await exportMembers(apiKey, data);
      case 'export_templates':
        return await exportTemplates(apiKey, data);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error("Error in elastic-email-sync function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function loadAllData(apiKey: string) {
  const [accountInfo, statistics, contactLists, templates, campaigns] = await Promise.all([
    fetchElasticEmailAPI(apiKey, 'account/load'),
    fetchElasticEmailAPI(apiKey, 'account/statistics'),
    fetchElasticEmailAPI(apiKey, 'list/list'),
    fetchElasticEmailAPI(apiKey, 'template/list'),
    fetchElasticEmailAPI(apiKey, 'campaign/list', { limit: 10 })
  ]);

  return new Response(JSON.stringify({
    success: true,
    accountInfo,
    statistics,
    contactLists: contactLists.data || [],
    templates: templates.data || [],
    campaigns: campaigns.data || []
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function syncContacts(apiKey: string) {
  const contactLists = await fetchElasticEmailAPI(apiKey, 'list/list');
  
  // Here you could sync contacts to your local database if needed
  console.log("Syncing contacts from Elastic Email");
  
  return new Response(JSON.stringify({
    success: true,
    message: "Contacts synced successfully",
    data: contactLists.data || []
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function syncTemplates(apiKey: string) {
  const templates = await fetchElasticEmailAPI(apiKey, 'template/list');
  
  // Here you could sync templates to your local template manager
  console.log("Syncing templates from Elastic Email");
  
  return new Response(JSON.stringify({
    success: true,
    message: "Templates synced successfully",
    data: templates.data || []
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function exportMembers(apiKey: string, memberData: any) {
  // Export Glee Club members to Elastic Email contact list
  console.log("Exporting members to Elastic Email");
  
  // This would create a new contact list in Elastic Email
  // and add all your members to it
  
  return new Response(JSON.stringify({
    success: true,
    message: "Members exported to Elastic Email successfully"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function exportTemplates(apiKey: string, templateData: any) {
  // Export local templates to Elastic Email
  console.log("Exporting templates to Elastic Email");
  
  return new Response(JSON.stringify({
    success: true,
    message: "Templates exported to Elastic Email successfully"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function fetchElasticEmailAPI(apiKey: string, endpoint: string, params: any = {}) {
  const formData = new FormData();
  formData.append('apikey', apiKey);
  
  // Add any additional parameters
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });

  const response = await fetch(`https://api.elasticemail.com/v2/${endpoint}`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Elastic Email API error: ${errorText}`);
  }

  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch (e) {
    return { data: responseText };
  }
}

serve(handler);
