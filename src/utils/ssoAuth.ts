
import { supabase } from '@/integrations/supabase/client';

export interface SSOTokenData {
  user_id: string;
  email: string;
  expires_at: number;
  signature: string;
}

// Generate a secure token for SSO
export const generateSSOToken = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('No active session for SSO token generation');
      return null;
    }

    // Create token payload
    const tokenData: Omit<SSOTokenData, 'signature'> = {
      user_id: session.user.id,
      email: session.user.email || '',
      expires_at: Date.now() + (60 * 60 * 1000) // 1 hour expiry
    };

    // Call edge function to generate signed token
    const { data, error } = await supabase.functions.invoke('generate-sso-token', {
      body: tokenData
    });

    if (error) {
      console.error('Error generating SSO token:', error);
      return null;
    }

    return data.token;
  } catch (error) {
    console.error('SSO token generation failed:', error);
    return null;
  }
};

// Validate SSO token (for use in reader app)
export const validateSSOToken = async (token: string): Promise<SSOTokenData | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('validate-sso-token', {
      body: { token }
    });

    if (error) {
      console.error('Error validating SSO token:', error);
      return null;
    }

    return data.tokenData;
  } catch (error) {
    console.error('SSO token validation failed:', error);
    return null;
  }
};

// Generate authenticated URL for reader with SSO token
export const generateReaderAuthURL = async (): Promise<string> => {
  const baseURL = 'https://reader.gleeworld.org';
  
  try {
    const token = await generateSSOToken();
    
    if (!token) {
      console.log('No SSO token available, using base URL');
      return baseURL;
    }

    // Add SSO token as URL parameter
    return `${baseURL}?sso_token=${encodeURIComponent(token)}`;
  } catch (error) {
    console.error('Error generating reader auth URL:', error);
    return baseURL;
  }
};
