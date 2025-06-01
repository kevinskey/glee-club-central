
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, Users, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import { useUserCreate } from "@/hooks/user/useUserCreate";
import { UserFormValues } from "./form/userFormSchema";

interface CSVRow {
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Phone?: string;
  VoicePart?: string;
  ClassYear?: string;
  Role?: string;
}

interface ValidationResult {
  valid: CSVRow[];
  invalid: Array<{ row: CSVRow; errors: string[] }>;
}

export const MemberCSVUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    total: number;
    successful: number;
    failed: number;
    duplicates: number;
    errors: string[];
  } | null>(null);

  const { addUser } = useUserCreate();

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

      if (!row.Password?.trim()) {
        errors.push("Password is required");
      } else if (row.Password.trim().length < 6) {
        errors.push("Password must be at least 6 characters");
      }

      if (errors.length > 0) {
        invalid.push({ row, errors });
      } else {
        valid.push({
          FirstName: row.FirstName.trim(),
          LastName: row.LastName.trim(),
          Email: row.Email.trim().toLowerCase(),
          Password: row.Password.trim(),
          Phone: row.Phone?.trim() || '',
          VoicePart: row.VoicePart?.trim() || '',
          ClassYear: row.ClassYear?.trim() || '',
          Role: row.Role?.trim() || 'member'
        });
      }
    });

    return { valid, invalid };
  };

  const insertUsers = async (users: CSVRow[]) => {
    const insertResults = {
      total: users.length,
      successful: 0,
      failed: 0,
      duplicates: 0,
      errors: [] as string[]
    };

    for (const user of users) {
      try {
        const userData: UserFormValues = {
          first_name: user.FirstName,
          last_name: user.LastName,
          email: user.Email,
          password: user.Password,
          phone: user.Phone || undefined,
          voice_part: user.VoicePart || '',
          class_year: user.ClassYear || undefined,
          role: user.Role === 'admin' ? 'admin' : 'member',
          is_admin: user.Role === 'admin',
          status: 'active',
          dues_paid: false,
          join_date: new Date().toISOString().split('T')[0]
        };

        const success = await addUser(userData);
        
        if (success) {
          insertResults.successful++;
        } else {
          insertResults.failed++;
          insertResults.errors.push(`Failed to create user ${user.Email}`);
        }
      } catch (err) {
        insertResults.failed++;
        insertResults.errors.push(`Failed to create user ${user.Email}: ${err}`);
      }
    }

    return insertResults;
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
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (parseResults) => {
          try {
            console.log('Parsed CSV data:', parseResults.data);
            
            const validation = validateCSVData(parseResults.data as any[]);
            
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

            const finalResults = await insertUsers(validation.valid);
            setUploadResults(finalResults);

            if (finalResults.successful > 0) {
              toast.success(`Successfully created ${finalResults.successful} users!`);
            }
            if (finalResults.failed > 0) {
              toast.error(`${finalResults.failed} users failed to create`);
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
  }, [file, addUser]);

  const downloadTemplate = () => {
    const csvContent = "FirstName,LastName,Email,Password,Phone,VoicePart,ClassYear,Role\nJohn,Doe,john.doe@example.com,password123,555-1234,Tenor,2024,member\nJane,Smith,jane.smith@example.com,password456,555-5678,Soprano,2025,admin";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Bulk User Creation
        </CardTitle>
        <CardDescription>
          Upload a CSV file to create multiple users at once. Each row should contain user information.
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
            Required columns: FirstName, LastName, Email, Password. Optional: Phone, VoicePart, ClassYear, Role
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
              Upload and Create Users
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
                  <p>Successfully created: {uploadResults.successful}</p>
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
