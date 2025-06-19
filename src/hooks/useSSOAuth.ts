
import { useState, useCallback } from 'react';
import { generateReaderAuthURL } from '@/utils/ssoAuth';
import { useAuth } from '@/contexts/AuthContext';

export const useSSOAuth = () => {
  const [isGeneratingURL, setIsGeneratingURL] = useState(false);
  const { isAuthenticated } = useAuth();

  const getAuthenticatedReaderURL = useCallback(async (): Promise<string> => {
    if (!isAuthenticated) {
      return 'https://reader.gleeworld.org';
    }

    setIsGeneratingURL(true);
    try {
      const authURL = await generateReaderAuthURL();
      return authURL;
    } catch (error) {
      console.error('Error generating authenticated reader URL:', error);
      return 'https://reader.gleeworld.org';
    } finally {
      setIsGeneratingURL(false);
    }
  }, [isAuthenticated]);

  const openReaderWithAuth = useCallback(async () => {
    const url = await getAuthenticatedReaderURL();
    window.open(url, '_blank');
  }, [getAuthenticatedReaderURL]);

  return {
    getAuthenticatedReaderURL,
    openReaderWithAuth,
    isGeneratingURL
  };
};
