
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle, CheckCircle, Download, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CSVRow {
  email?: string;
  first_name?: string;
  last_name?: string;
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

interface UserCSVImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function UserCSVImport({ isOpen, onClose, onImportComplete }: UserCSVImportProps) {
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
    a.download = 'user_import_template.csv';
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

  const generateFallbackEmail = (firstName: string, lastName: string, index: number): string => {
    const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
    return `${cleanFirst}.${cleanLast}.${index}@temp.spelman.edu`;
  };

  const createUser = async (userData: CSVRow, index: number): Promise<void> => {
    try {
      // Provide fallback values for missing data
      const firstName = userData.first_name || 'Member';
      const lastName = userData.last_name || `User${index + 1}`;
      const email = userData.email || generateFallbackEmail(firstName, lastName, index);
      
      console.log('Creating user:', email);
      
      // Generate a secure temporary password
      const tempPassword = `Temp${Math.random().toString(36).substring(2, 8)}Glee!1`;
      
      // Create auth user using admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (authError) {
        console.error('Auth creation error:', authError);
        throw new Error(`Failed to create auth user: ${authError.message}`);
      }
      
      if (!authData.user?.id) {
        throw new Error('User creation failed - no user ID returned');
      }

      console.log('Auth user created:', authData.user.id);

      // Parse boolean and date values with fallbacks
      const duesPaid = userData.dues_paid?.toLowerCase() === 'true';
      const joinDate = userData.join_date || new Date().toISOString().split('T')[0];
      const phone = userData.phone || null;
      const voicePart = userData.voice_part || null;
      const status = userData.status || 'active';
      const classYear = userData.class_year || null;
      const notes = userData.notes || null;
      const role = userData.role || 'member';

      // Create/update profile with additional data
      const profileData = {
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        voice_part: voicePart,
        status: status,
        class_year: classYear,
        notes: notes,
        dues_paid: duesPaid,
        join_date: joinDate,
        role: role,
        is_super_admin: role === 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Creating profile with data:', profileData);

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Try to clean up the auth user if profile creation fails
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }

      console.log('Profile created successfully for:', email);
    } catch (error: any) {
      console.error('User creation failed:', error);
      throw error;
    }
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

    console.log(`Starting upload of ${csvData.length} users`);

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      setUploadProgress(((i + 1) / csvData.length) * 100);

      const displayEmail = row.email || `Row ${i + 2}`;
      console.log(`Processing row ${i + 1}/${csvData.length}:`, displayEmail);

      try {
        await createUser(row, i);
        result.success++;
        console.log(`Successfully created user ${result.success}:`, displayEmail);
      } catch (error: any) {
        console.error(`Failed to create user ${displayEmail}:`, error);
        result.errors.push({
          row: i + 2,
          email: displayEmail,
          error: error.message || 'Unknown error occurred'
        });
      }

      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('Upload completed:', result);
    setUploadResult(result);
    setIsUploading(false);
    setCsvData([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (result.success > 0) {
      toast.success(`Successfully created ${result.success} users`);
      onImportComplete();
    }
    
    if (result.errors.length > 0) {
      toast.error(`${result.errors.length} users failed to create`);
    }
  };

  const handleClose = () => {
    setCsvData([]);
    setUploadResult(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Users from CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV file to create multiple users at once. All fields are optional - missing data will be filled with appropriate defaults.
                  Available fields: email, first_name, last_name, phone, voice_part, role, status, class_year, notes, dues_paid, join_date.
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                  disabled={isUploading}
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to select a CSV file or drag and drop
                  </p>
                </label>
              </div>

              {csvData.length > 0 && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    {csvData.length} rows loaded and ready for import.
                  </AlertDescription>
                </Alert>
              )}

              {isUploading && (
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Creating users...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}

              <Button
                onClick={handleUpload}
                disabled={isUploading || csvData.length === 0}
                className="w-full mt-4"
              >
                {isUploading ? 'Creating Users...' : `Import ${csvData.length} Users`}
              </Button>
            </CardContent>
          </Card>

          {uploadResult && (
            <Card>
              <CardHeader>
                <CardTitle>Import Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Successfully created: {uploadResult.success} users
                  </p>
                  {uploadResult.errors.length > 0 && (
                    <div>
                      <p className="text-red-600 flex items-center gap-2 mb-2">
                        <AlertCircle className="h-4 w-4" />
                        Failed to create: {uploadResult.errors.length} users
                      </p>
                      <div className="max-h-40 overflow-y-auto space-y-1 bg-gray-50 p-3 rounded">
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
      </DialogContent>
    </Dialog>
  );
}
