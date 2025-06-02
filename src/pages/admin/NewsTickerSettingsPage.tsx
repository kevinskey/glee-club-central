import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';

export default function NewsTickerSettingsPage() {
  const { user, isLoading } = useAuth();
  const [tickerText, setTickerText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching existing ticker text from a database or API
    const fetchTickerText = async () => {
      // Replace this with your actual data fetching logic
      await new Promise(resolve => setTimeout(resolve, 500));
      setTickerText('Breaking News: Glee Club wins national award!');
    };

    fetchTickerText();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      // Simulate saving the ticker text to a database or API
      // Replace this with your actual data saving logic
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Ticker text saved successfully!');
    } catch (error: any) {
      setErrorMessage(`Failed to save ticker text: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>News Ticker Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {successMessage && (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
              <span className="font-medium">Success!</span> {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              <span className="font-medium">Error!</span> {errorMessage}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="tickerText">Ticker Text</Label>
            <Textarea
              id="tickerText"
              placeholder="Enter news ticker text"
              value={tickerText}
              onChange={(e) => setTickerText(e.target.value)}
            />
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
