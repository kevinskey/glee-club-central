
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CSVRow {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  voice_part?: string;
  role?: string;
  status?: string;
  class_year?: string;
  notes?: string;
  dues_paid?: string;
  join_date?: string;
}

interface UploadResult {
  success: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

export function MemberCSVUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const csvContent = `email,first_name,last_name,phone,voice_part,role,status,class_year,notes,dues_paid,join_date
example@spelman.edu,Jane,Doe,555-0123,soprano_1,member,active,2025,Sample notes,true,2024-01-15
student@spelman.edu,Mary,Smith,555-0124,alto_1,member,active,2026,Another member,false,2024-02-01`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): CSVRow[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row as CSVRow;
    });
  };

  const validateRow = (row: CSVRow, index: number): string | null => {
    if (!row.email || !row.email.includes('@')) {
      return `Row ${index + 2}: Invalid email address`;
    }
    if (!row.first_name) {
      return `Row ${index + 2}: First name is required`;
    }
    if (!row.last_name) {
      return `Row ${index + 2}: Last name is required`;
    }
    return null;
  };

  const createUser = async (userData: CSVRow): Promise<void> => {
    // Generate a temporary password
    const tempPassword = Math.random().toString(36).substring(2, 10) + 'Aa1!';
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: tempPassword,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user?.id) throw new Error('User creation failed');

    // Parse boolean and date values
    const duesPaid = userData.dues_paid?.toLowerCase() === 'true';
    const joinDate = userData.join_date || new Date().toISOString().split('T')[0];

    // Update profile with additional data
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        phone: userData.phone || null,
        voice_part: userData.voice_part || null,
        status: userData.status || 'active',
        class_year: userData.class_year || null,
        notes: userData.notes || null,
        dues_paid: duesPaid,
        join_date: joinDate,
        role: userData.role || 'member',
        is_super_admin: userData.role === 'admin',
      })
      .eq('id', authData.user.id);

    if (profileError) throw profileError;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    const text = await file.text();
    try {
      const parsed = parseCSV(text);
      setCsvData(parsed);
      toast.success(`Parsed ${parsed.length} rows from CSV`);
    } catch (error) {
      toast.error('Failed to parse CSV file');
      console.error('CSV parsing error:', error);
    }
  };

  const handleUpload = async () => {
    if (csvData.length === 0) {
      toast.error('Please select a CSV file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const result: UploadResult = {
      success: 0,
      errors: []
    };

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      setUploadProgress(((i + 1) / csvData.length) * 100);

      // Validate row
      const validationError = validateRow(row, i);
      if (validationError) {
        result.errors.push({
          row: i + 2,
          email: row.email,
          error: validationError
        });
        continue;
      }

      try {
        await createUser(row);
        result.success++;
      } catch (error: any) {
        result.errors.push({
          row: i + 2,
          email: row.email,
          error: error.message
        });
      }

      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setUploadResult(result);
    setIsUploading(false);
    setCsvData([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (result.success > 0) {
      toast.success(`Successfully created ${result.success} members`);
    }
    
    if (result.errors.length > 0) {
      toast.error(`${result.errors.length} members failed to create`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Member Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload a CSV file to create multiple members at once. Required fields: email, first_name, last_name.
              Optional fields: phone, voice_part, role, status, class_year, notes, dues_paid, join_date.
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to select a CSV file or drag and drop
              </p>
            </label>
          </div>

          {csvData.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {csvData.length} rows loaded and ready for upload.
              </AlertDescription>
            </Alert>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading members...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={isUploading || csvData.length === 0}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : `Upload ${csvData.length} Members`}
          </Button>
        </CardContent>
      </Card>

      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-green-600">✅ Successfully created: {uploadResult.success} members</p>
              {uploadResult.errors.length > 0 && (
                <div>
                  <p className="text-red-600 mb-2">❌ Failed to create: {uploadResult.errors.length} members</p>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-500">
                        {error.email}: {error.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
