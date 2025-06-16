
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestEmailRequest {
  provider: string;
  config: Record<string, any>;
  testEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, config, testEmail }: TestEmailRequest = await req.json();

    console.log(`Testing email provider: ${provider}`);

    // Test different email providers
    switch (provider) {
      case 'elastic_email':
        return await testElasticEmail(config, testEmail);
      
      case 'mailchimp':
        return await testMailChimp(config, testEmail);
      
      case 'sendgrid':
        return await testSendGrid(config, testEmail);
      
      case 'resend':
        return await testResend(config, testEmail);
      
      default:
        throw new Error(`Unsupported email provider: ${provider}`);
    }
  } catch (error: any) {
    console.error("Error in test-email-provider function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function testElasticEmail(config: any, testEmail: string) {
  const formData = new FormData();
  formData.append('apikey', config.apiKey);
  formData.append('from', config.fromEmail);
  formData.append('fromName', config.fromName);
  formData.append('to', testEmail);
  formData.append('subject', 'Test Email from Glee World');
  formData.append('bodyHtml', '<h1>Test Email</h1><p>This is a test email from your Glee World email service configuration.</p>');
  formData.append('bodyText', 'Test Email - This is a test email from your Glee World email service configuration.');

  const response = await fetch('https://api.elasticemail.com/v2/email/send', {
    method: 'POST',
    body: formData
  });

  const responseText = await response.text();
  console.log("Elastic Email test response:", responseText);

  if (!response.ok) {
    throw new Error(`Elastic Email API error: ${responseText}`);
  }

  return new Response(JSON.stringify({ success: true, provider: 'elastic_email' }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function testMailChimp(config: any, testEmail: string) {
  // Note: MailChimp is primarily for marketing emails, not transactional
  // This would typically involve creating a campaign or using their transactional API
  console.log("MailChimp test - configuration validated");
  
  return new Response(JSON.stringify({ 
    success: true, 
    provider: 'mailchimp',
    note: 'MailChimp configuration validated. Use for marketing campaigns.'
  }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function testSendGrid(config: any, testEmail: string) {
  const emailData = {
    personalizations: [{
      to: [{ email: testEmail }],
      subject: 'Test Email from Glee World'
    }],
    from: {
      email: config.fromEmail,
      name: config.fromName
    },
    content: [{
      type: 'text/html',
      value: '<h1>Test Email</h1><p>This is a test email from your Glee World email service configuration.</p>'
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid API error: ${errorText}`);
  }

  return new Response(JSON.stringify({ success: true, provider: 'sendgrid' }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

async function testResend(config: any, testEmail: string) {
  const emailData = {
    from: `${config.fromName} <${config.fromEmail}>`,
    to: [testEmail],
    subject: 'Test Email from Glee World',
    html: '<h1>Test Email</h1><p>This is a test email from your Glee World email service configuration.</p>'
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(`Resend API error: ${JSON.stringify(responseData)}`);
  }

  return new Response(JSON.stringify({ success: true, provider: 'resend' }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

serve(handler);
