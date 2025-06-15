
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Papa from 'papaparse';

interface CSVRow {
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  voice_part?: string;
  phone?: string;
  class_year?: string;
}

interface ProcessingResult {
  success: boolean;
  email: string;
  error?: string;
  user_id?: string;
}

export function MemberCSVUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessingResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const downloadTemplate = () => {
    const headers = ['email', 'first_name', 'last_name', 'role', 'voice_part', 'phone', 'class_year'];
    const sampleData = [
      'student@spelman.edu,Jane,Doe,member,soprano_1,555-0123,2025'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('CSV parsed:', results.data);
        setCsvData(results.data as CSVRow[]);
        setResults([]);
        setShowResults(false);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast.error('Failed to parse CSV file');
      }
    });
  };

  const validateRow = (row: CSVRow): string | null => {
    if (!row.email || !row.email.includes('@')) {
      return 'Invalid email address';
    }
    if (!row.first_name?.trim()) {
      return 'First name is required';
    }
    if (!row.last_name?.trim()) {
      return 'Last name is required';
    }
    return null;
  };

  const createUser = async (userData: CSVRow): Promise<ProcessingResult> => {
    try {
      console.log('Creating user:', userData);

      // Validate the row data
      const validationError = validateRow(userData);
      if (validationError) {
        return {
          success: false,
          email: userData.email,
          error: validationError
        };
      }

      // Use the new database function to create the user
      const { data, error } = await supabase.rpc('admin_create_user', {
        user_email: userData.email.trim(),
        user_first_name: userData.first_name.trim(),
        user_last_name: userData.last_name.trim(),
        user_role: userData.role || 'member',
        user_voice_part: userData.voice_part || null,
        user_phone: userData.phone || null,
        user_class_year: userData.class_year || null
      });

      if (error) {
        console.error('Database function error:', error);
        return {
          success: false,
          email: userData.email,
          error: error.message
        };
      }

      // Check if the function returned an error
      if (data && typeof data === 'object' && 'error' in data) {
        return {
          success: false,
          email: userData.email,
          error: data.error
        };
      }

      // Success case
      return {
        success: true,
        email: userData.email,
        user_id: data?.user_id
      };

    } catch (error) {
      console.error('Unexpected error creating user:', error);
      return {
        success: false,
        email: userData.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const processBulkUpload = async () => {
    if (csvData.length === 0) {
      toast.error('No data to process');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setResults([]);
    setShowResults(true);

    const batchSize = 5; // Process in smaller batches to avoid overwhelming the database
    const totalRows = csvData.length;
    const processedResults: ProcessingResult[] = [];

    for (let i = 0; i < totalRows; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchPromises = batch.map(row => createUser(row));
      const batchResults = await Promise.all(batchPromises);
      
      processedResults.push(...batchResults);
      setResults([...processedResults]);
      
      // Update progress
      const progressPercentage = Math.round(((i + batch.length) / totalRows) * 100);
      setProgress(progressPercentage);
      
      // Small delay between batches to be gentle on the database
      if (i + batchSize < totalRows) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    setIsProcessing(false);
    setProgress(100);

    const successCount = processedResults.filter(r => r.success).length;
    const failCount = processedResults.filter(r => !r.success).length;

    console.log(`✅ Successfully created: ${successCount} members`);
    console.log(`❌ Failed to create: ${failCount} members`);

    if (failCount > 0) {
      processedResults.filter(r => !r.success).forEach(result => {
        console.log(`${result.email}: ${result.error}`);
      });
    }

    toast.success(`Bulk upload completed! ${successCount} users created, ${failCount} failed.`);
  };

  const clearAll = () => {
    setFile(null);
    setCsvData([]);
    setResults([]);
    setShowResults(false);
    setProgress(0);
    const fileInput = document.getElementById('csv-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Download a CSV template with the correct format for bulk member upload.
          </p>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-glee-spelman file:text-white hover:file:bg-glee-spelman/90"
              />
              {file && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  <X className="mr-2 h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>

            {file && (
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  File loaded: <strong>{file.name}</strong> ({csvData.length} rows)
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Found {csvData.length} members to upload. Review the data below:
              </p>
              
              <div className="max-h-60 overflow-y-auto border rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Voice Part</th>
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{row.email}</td>
                        <td className="p-2">{row.first_name} {row.last_name}</td>
                        <td className="p-2">{row.role || 'member'}</td>
                        <td className="p-2">{row.voice_part || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 10 && (
                  <div className="p-2 text-center text-sm text-muted-foreground border-t">
                    ... and {csvData.length - 10} more rows
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={processBulkUpload} 
                  disabled={isProcessing}
                  className="bg-glee-spelman hover:bg-glee-spelman/90"
                >
                  {isProcessing ? 'Processing...' : 'Start Bulk Upload'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Processing... {progress}% complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {showResults && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Results
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-600">
                  {successCount} Success
                </Badge>
                <Badge variant="destructive">
                  {failCount} Failed
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded text-sm ${
                    result.success 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="font-medium">{result.email}</span>
                  {result.error && (
                    <span className="text-xs">- {result.error}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
