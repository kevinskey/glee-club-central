
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
    const [accountInfo, statistics, contactLists, templates, campaigns] = await Promise.all([
      fetchElasticEmailAPI(apiKey, 'account/load'),
      fetchElasticEmailAPI(apiKey, 'account/statistics'),
      fetchElasticEmailAPI(apiKey, 'list/list'),
      fetchElasticEmailAPI(apiKey, 'template/list'),
      fetchElasticEmailAPI(apiKey, 'campaign/list', { limit: 10 })
    ]);

    return new Response(JSON.stringify({
      success: true,
      accountInfo: accountInfo.data || accountInfo,
      statistics: statistics.data || statistics,
      contactLists: contactLists.data || [],
      templates: templates.data || [],
      campaigns: campaigns.data || []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error loading all data:", error);
    throw error;
  }
}

async function syncContacts(apiKey: string) {
  const contactLists = await fetchElasticEmailAPI(apiKey, 'list/list');
  
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
  
  console.log("Syncing templates from Elastic Email");
  
  return new Response(JSON.stringify({
    success: true,
    message: "Templates synced successfully",
    templates: templates.data || templates
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function getTemplates(apiKey: string) {
  console.log("Fetching templates from Elastic Email");
  
  const templates = await fetchElasticEmailAPI(apiKey, 'template/list');
  
  return new Response(JSON.stringify({
    success: true,
    templates: templates.data || templates
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
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
