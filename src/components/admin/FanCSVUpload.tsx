
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Users, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Papa from "papaparse";

interface CSVRow {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone?: string;
  Class?: string;
}

interface ValidationResult {
  valid: CSVRow[];
  invalid: Array<{ row: CSVRow; errors: string[] }>;
}

export const FanCSVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    duplicates: number;
    errors: string[];
  } | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCSVData = (data: any[]): ValidationResult => {
    const valid: CSVRow[] = [];
    const invalid: Array<{ row: CSVRow; errors: string[] }> = [];

    data.forEach((row, index) => {
      const errors: string[] = [];
      
      if (!row.FirstName?.trim()) {
        errors.push("First name is required");
      }
      
      if (!row.LastName?.trim()) {
        errors.push("Last name is required");
      }
      
      if (!row.Email?.trim()) {
        errors.push("Email is required");
      } else if (!validateEmail(row.Email.trim())) {
        errors.push("Invalid email format");
      }

      if (errors.length > 0) {
        invalid.push({ row, errors });
      } else {
        valid.push({
          FirstName: row.FirstName.trim(),
          LastName: row.LastName.trim(),
          Email: row.Email.trim().toLowerCase(),
          Phone: row.Phone?.trim() || '',
          Class: row.Class?.trim() || ''
        });
      }
    });

    return { valid, invalid };
  };

  const checkForDuplicates = async (users: CSVRow[]): Promise<string[]> => {
    const emails = users.map(user => user.Email);
    
    // Check existing profiles
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('id')
      .in('id', emails); // This won't work directly, need to check auth.users

    // Check existing fans
    const { data: existingFans } = await supabase
      .from('fans')
      .select('email')
      .in('email', emails);

    const existingEmails = new Set([
      ...(existingFans?.map(f => f.email) || [])
    ]);

    return emails.filter(email => existingEmails.has(email));
  };

  const insertFans = async (users: CSVRow[]) => {
    const results = {
      total: users.length,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    // Check for duplicates
    const duplicateEmails = await checkForDuplicates(users);
    const uniqueUsers = users.filter(user => !duplicateEmails.includes(user.Email));
    results.duplicates = duplicateEmails.length;

    // Insert unique users as fans
    for (const user of uniqueUsers) {
      try {
        const { error } = await supabase
          .from('fans')
          .insert({
            full_name: `${user.FirstName} ${user.LastName}`,
            email: user.Email,
            notes: user.Phone ? `Phone: ${user.Phone}${user.Class ? `, Class: ${user.Class}` : ''}` : (user.Class ? `Class: ${user.Class}` : null)
          });

        if (error) {
          results.failed++;
          results.errors.push(`Failed to insert ${user.Email}: ${error.message}`);
        } else {
          results.successful++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push(`Failed to insert ${user.Email}: ${err}`);
      }
    }

    return results;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setUploadResults(null);
    } else {
      toast.error("Please select a valid CSV file");
      setFile(null);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsUploading(true);
    setUploadResults(null);

    try {
      // Parse CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            console.log('Parsed CSV data:', results.data);
            
            // Validate data
            const validation = validateCSVData(results.data as any[]);
            
            if (validation.invalid.length > 0) {
              const errorMessages = validation.invalid.map(
                (item, index) => `Row ${index + 1}: ${item.errors.join(', ')}`
              );
              toast.error(`Validation errors found:\n${errorMessages.slice(0, 3).join('\n')}${errorMessages.length > 3 ? '\n...' : ''}`);
              setIsUploading(false);
              return;
            }

            if (validation.valid.length === 0) {
              toast.error("No valid data found in CSV file");
              setIsUploading(false);
              return;
            }

            // Insert fans
            const results = await insertFans(validation.valid);
            setUploadResults(results);

            if (results.successful > 0) {
              toast.success(`Successfully added ${results.successful} fans!`);
            }
            if (results.duplicates > 0) {
              toast.warning(`${results.duplicates} duplicates were skipped`);
            }
            if (results.failed > 0) {
              toast.error(`${results.failed} records failed to import`);
            }

          } catch (error) {
            console.error('Error processing CSV:', error);
            toast.error("Failed to process CSV file");
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast.error("Failed to parse CSV file");
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload file");
      setIsUploading(false);
    }
  }, [file]);

  const downloadTemplate = () => {
    const csvContent = "FirstName,LastName,Email,Phone,Class\nJohn,Doe,john.doe@example.com,555-1234,2024\nJane,Smith,jane.smith@example.com,555-5678,2025";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fan_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk Fan Registration
        </CardTitle>
        <CardDescription>
          Upload a CSV file to register multiple fans at once. Each row should contain fan information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <h4 className="font-medium">Need a template?</h4>
            <p className="text-sm text-muted-foreground">
              Download a sample CSV file with the correct format
            </p>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">
            Required columns: FirstName, LastName, Email. Optional: Phone, Class
          </p>
        </div>

        {/* Upload Button */}
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload and Register Fans
            </>
          )}
        </Button>

        {/* Results */}
        {uploadResults && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>Upload Complete!</strong></p>
                  <p>Total records: {uploadResults.total}</p>
                  <p>Successfully added: {uploadResults.successful}</p>
                  <p>Duplicates skipped: {uploadResults.duplicates}</p>
                  <p>Failed: {uploadResults.failed}</p>
                </div>
              </AlertDescription>
            </Alert>

            {uploadResults.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p><strong>Errors:</strong></p>
                    {uploadResults.errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-sm">{error}</p>
                    ))}
                    {uploadResults.errors.length > 5 && (
                      <p className="text-sm">... and {uploadResults.errors.length - 5} more errors</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
