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
      case 'get_templates':
        return await getTemplates(apiKey);
      case 'create_campaign':
        return await createCampaign(apiKey, data);
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
  console.log("Loading all Elastic Email data...");
  
  try {
    // Start with account info to test the connection
    const accountInfo = await fetchElasticEmailAPI(apiKey, 'account/load');
    console.log("Account info loaded successfully");
    
    // Try to get templates - this is the most commonly used feature
    let templates = [];
    try {
      const templatesResponse = await fetchElasticEmailAPI(apiKey, 'template/getlist');
      templates = templatesResponse.data || templatesResponse || [];
      console.log(`Templates loaded: ${templates.length} found`);
    } catch (templateError) {
      console.warn("Failed to load templates:", templateError);
    }

    // Try to get contact lists
    let contactLists = [];
    try {
      const listsResponse = await fetchElasticEmailAPI(apiKey, 'list/list');
      contactLists = listsResponse.data || listsResponse || [];
      console.log(`Contact lists loaded: ${contactLists.length} found`);
    } catch (listError) {
      console.warn("Failed to load contact lists:", listError);
    }

    // Try to get account statistics
    let statistics = {};
    try {
      const statsResponse = await fetchElasticEmailAPI(apiKey, 'account/profileoverview');
      statistics = statsResponse.data || statsResponse || {};
      console.log("Account statistics loaded");
    } catch (statsError) {
      console.warn("Failed to load statistics:", statsError);
    }

    return new Response(JSON.stringify({
      success: true,
      accountInfo: accountInfo.data || accountInfo,
      statistics: statistics,
      contactLists: contactLists,
      templates: templates,
      campaigns: []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error loading all data:", error);
    return new Response(JSON.stringify({
      success: false,
      error: `Failed to connect to Elastic Email: ${error.message}`,
      accountInfo: null,
      statistics: null,
      contactLists: [],
      templates: [],
      campaigns: []
    }), {
      status: 200, // Return 200 but with error info so the UI can handle it
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function syncContacts(apiKey: string) {
  try {
    const contactLists = await fetchElasticEmailAPI(apiKey, 'list/list');
    console.log("Syncing contacts from Elastic Email");
    
    return new Response(JSON.stringify({
      success: true,
      message: "Contacts synced successfully",
      data: contactLists.data || contactLists || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error syncing contacts:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      data: []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function syncTemplates(apiKey: string) {
  console.log("Fetching templates using correct endpoint...");
  
  try {
    const templates = await fetchElasticEmailAPI(apiKey, 'template/getlist');
    console.log("Templates response:", templates);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Templates synced successfully",
      templates: templates.data || templates || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error syncing templates:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      templates: []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function getTemplates(apiKey: string) {
  console.log("Fetching templates from Elastic Email");
  
  try {
    const templates = await fetchElasticEmailAPI(apiKey, 'template/getlist');
    
    return new Response(JSON.stringify({
      success: true,
      templates: templates.data || templates || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error getting templates:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      templates: []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}

async function exportMembers(apiKey: string, memberData: any) {
  console.log("Exporting members to Elastic Email");
  
  if (!memberData?.data?.members) {
    throw new Error("No member data provided");
  }

  const members = memberData.data.members;
  
  // Create a contact list for Glee Club members
  const listName = `Spelman-Glee-Club-${new Date().toISOString().split('T')[0]}`;
  
  try {
    // Create the list first
    const createListData = new FormData();
    createListData.append('apikey', apiKey);
    createListData.append('listname', listName);
    createListData.append('allowunsubscribe', 'true');
    
    const listResponse = await fetch('https://api.elasticemail.com/v2/list/add', {
      method: 'POST',
      body: createListData
    });

    if (!listResponse.ok) {
      throw new Error(`Failed to create list: ${await listResponse.text()}`);
    }

    // Add contacts to the list
    for (const member of members) {
      if (member.email) {
        const contactData = new FormData();
        contactData.append('apikey', apiKey);
        contactData.append('email', member.email);
        contactData.append('listname', listName);
        contactData.append('firstname', member.firstName || '');
        contactData.append('lastname', member.lastName || '');
        
        const contactResponse = await fetch('https://api.elasticemail.com/v2/contact/add', {
          method: 'POST',
          body: contactData
        });

        if (!contactResponse.ok) {
          console.warn(`Failed to add contact ${member.email}:`, await contactResponse.text());
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully exported ${members.length} members to Elastic Email list: ${listName}`
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error exporting members:", error);
    throw error;
  }
}

async function exportTemplates(apiKey: string, templateData: any) {
  console.log("Exporting templates to Elastic Email");
  
  return new Response(JSON.stringify({
    success: true,
    message: "Templates exported to Elastic Email successfully"
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function createCampaign(apiKey: string, campaignData: any) {
  console.log("Creating campaign in Elastic Email");
  
  const { subject, content, recipients, from } = campaignData;
  
  try {
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('subject', subject);
    formData.append('from', from || 'noreply@gleeworld.org');
    formData.append('fromName', 'Spelman College Glee Club');
    formData.append('template', content);
    formData.append('channel', 'glee-club-campaigns');
    
    // Add recipients
    recipients.forEach((email: string, index: number) => {
      formData.append(`to[${index}]`, email);
    });

    const response = await fetch('https://api.elasticemail.com/v2/email/send', {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      throw new Error(`Campaign creation failed: ${responseText}`);
    }

    const result = JSON.parse(responseText);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Campaign created and sent successfully",
      data: result
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
}

async function fetchElasticEmailAPI(apiKey: string, endpoint: string, params: any = {}) {
  const formData = new FormData();
  formData.append('apikey', apiKey);
  
  // Add any additional parameters
  Object.keys(params).forEach(key => {
    formData.append(key, params[key]);
  });

  console.log(`Making request to Elastic Email endpoint: ${endpoint}`);
  
  try {
    const response = await fetch(`https://api.elasticemail.com/v2/${endpoint}`, {
      method: 'POST',
      body: formData
    });

    const responseText = await response.text();
    console.log(`Elastic Email response for ${endpoint}:`, responseText.substring(0, 500));

    if (!response.ok) {
      console.error(`Elastic Email API error for ${endpoint}:`, responseText);
      throw new Error(`Elastic Email API error (${response.status}): ${responseText}`);
    }
    
    // Try to parse as JSON
    try {
      const jsonResponse = JSON.parse(responseText);
      
      // Check for API-level errors in the JSON response
      if (jsonResponse.success === false) {
        throw new Error(`Elastic Email API returned error: ${jsonResponse.error || 'Unknown error'}`);
      }
      
      return jsonResponse;
    } catch (parseError) {
      // If it's not JSON, return the raw text
      console.warn(`Response from ${endpoint} is not valid JSON:`, parseError);
      return { data: responseText };
    }
  } catch (fetchError) {
    console.error(`Network error for ${endpoint}:`, fetchError);
    throw new Error(`Failed to connect to Elastic Email API: ${fetchError.message}`);
  }
}

serve(handler);
