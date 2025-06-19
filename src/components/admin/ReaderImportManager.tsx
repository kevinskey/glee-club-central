
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { readerImporter } from '@/utils/readerImport';
import { 
  Download, 
  FileText, 
  Music, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  Info
} from 'lucide-react';

interface ImportProgress {
  stage: string;
  current: number;
  total: number;
  completed: boolean;
}

export function ReaderImportManager() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [importResults, setImportResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  const handleTestConnection = async () => {
    try {
      setIsTesting(true);
      setError(null);
      setConnectionStatus(null);
      
      toast({ title: "Testing connection...", description: "Checking reader.gleeworld.org availability" });
      
      const result = await readerImporter.testConnection();
      
      setConnectionStatus(result);
      
      if (result.success) {
        toast({ 
          title: "Connection successful", 
          description: "reader.gleeworld.org is accessible",
          variant: "default"
        });
      } else {
        setError(result.message);
        toast({ 
          title: "Connection failed", 
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      setConnectionStatus({ success: false, message: errorMessage });
      toast({ 
        title: "Connection failed", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      setImportResults(null);
      
      setImportProgress({
        stage: 'Testing connection...',
        current: 10,
        total: 100,
        completed: false
      });

      toast({ title: "Import started", description: "Testing connection and fetching content from reader.gleeworld.org" });

      setImportProgress({
        stage: 'Fetching data from reader.gleeworld.org...',
        current: 30,
        total: 100,
        completed: false
      });

      const results = await readerImporter.importAll();
      
      setImportProgress({
        stage: 'Import completed',
        current: 100,
        total: 100,
        completed: true
      });

      setImportResults(results);
      
      toast({ 
        title: "Import successful", 
        description: `Imported ${results.summary.importedPDFs} PDFs and ${results.summary.importedAudio} audio files`,
        variant: "default"
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Import failed';
      setError(errorMessage);
      setImportProgress(null);
      
      toast({ 
        title: "Import failed", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Reader Import Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Import PDFs and MP3s from reader.gleeworld.org into the main Glee World application.
          </div>

          {/* Connection Test */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={isImporting || isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>
              <span className="text-sm text-gray-500">
                Verify connection to reader.gleeworld.org
              </span>
            </div>

            {/* Connection Status */}
            {connectionStatus && (
              <Alert variant={connectionStatus.success ? "default" : "destructive"}>
                {connectionStatus.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {connectionStatus.success ? 'Connection successful' : 'Connection failed'}
                    </div>
                    <div className="text-sm">{connectionStatus.message}</div>
                    {connectionStatus.details && (
                      <details className="text-xs mt-2">
                        <summary>Technical details</summary>
                        <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          {JSON.stringify(connectionStatus.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Import Progress */}
          {importProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{importProgress.stage}</span>
                <span className="text-sm text-gray-500">
                  {importProgress.current}%
                </span>
              </div>
              <Progress value={importProgress.current} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Import Error:</div>
                  <div className="text-sm">{error}</div>
                  <div className="text-xs text-gray-500">
                    Check the browser console for detailed error logs.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Import Results */}
          {importResults && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Import Summary:</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>PDFs: {importResults.summary.importedPDFs}/{importResults.summary.totalPDFs}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      <span>Audio: {importResults.summary.importedAudio}/{importResults.summary.totalAudio}</span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Import Button */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleImport}
              disabled={isImporting || isTesting}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Import All Content
                </>
              )}
            </Button>
            
            {!isImporting && !isTesting && (
              <div className="text-sm text-gray-500">
                This will fetch and import all PDFs and audio files from reader.gleeworld.org
              </div>
            )}
          </div>

          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Import Process:</div>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Tests connection to reader.gleeworld.org</li>
                  <li>• Fetches PDFs from /api/pdfs endpoint</li>
                  <li>• Fetches audio files from /api/audio endpoint</li>
                  <li>• Imports metadata to Supabase tables</li>
                  <li>• Handles errors gracefully and continues with available data</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              <FileText className="h-3 w-3 mr-1" />
              Sheet Music PDFs
            </Badge>
            <Badge variant="outline">
              <Music className="h-3 w-3 mr-1" />
              Audio Files (MP3)
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
