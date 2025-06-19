
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
  ExternalLink 
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
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [importResults, setImportResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestConnection = async () => {
    try {
      setError(null);
      toast({ title: "Testing connection...", description: "Checking reader.gleeworld.org availability" });
      
      const response = await fetch('https://reader.gleeworld.org', { method: 'HEAD' });
      
      if (response.ok) {
        toast({ 
          title: "Connection successful", 
          description: "reader.gleeworld.org is accessible",
          variant: "default"
        });
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      toast({ 
        title: "Connection failed", 
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setError(null);
      setImportResults(null);
      
      setImportProgress({
        stage: 'Fetching data from reader.gleeworld.org...',
        current: 0,
        total: 100,
        completed: false
      });

      toast({ title: "Import started", description: "Fetching content from reader.gleeworld.org" });

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
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isImporting}
            >
              Test Connection
            </Button>
            <span className="text-sm text-gray-500">
              Verify connection to reader.gleeworld.org
            </span>
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
              <AlertDescription>{error}</AlertDescription>
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
              disabled={isImporting}
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
            
            {!isImporting && (
              <div className="text-sm text-gray-500">
                This will fetch and import all PDFs and audio files from reader.gleeworld.org
              </div>
            )}
          </div>

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
