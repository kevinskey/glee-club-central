
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
  dues_paid?: boolean;
  join_date?: string;
}

interface UploadResult {
  success: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

// ABSOLUTELY strict role validation - only these three values allowed, no exceptions
const VALID_ROLES = ['admin', 'member', 'section_leader'] as const;
type ValidRole = typeof VALID_ROLES[number];

const validateRole = (roleInput: any): ValidRole => {
  // Handle null/undefined - default to member
  if (!roleInput || roleInput === null || roleInput === undefined) {
    console.log('🔧 Role is null/undefined, defaulting to member');
    return 'member';
  }
  
  // Convert to string and clean
  const roleStr = String(roleInput).toLowerCase().trim();
  
  // Handle empty strings
  if (!roleStr || roleStr === '' || roleStr === 'null' || roleStr === 'undefined') {
    console.log('🔧 Role is empty, defaulting to member');
    return 'member';
  }
  
  // Check if it's exactly one of our valid roles
  if (VALID_ROLES.includes(roleStr as ValidRole)) {
    console.log(`🔧 Role "${roleStr}" is valid`);
    return roleStr as ValidRole;
  }
  
  // Try basic mappings for common variations
  const mappings: { [key: string]: ValidRole } = {
    'administrator': 'member',  // Changed to member to be safe
    'admin_user': 'member',
    'section leader': 'member',  // Changed to member to be safe
    'leader': 'member',
    'student': 'member',
    'singer': 'member',
    'alumni': 'member',
    'alumna': 'member',
    'faculty': 'member'
  };
  
  if (mappings[roleStr]) {
    console.log(`🔧 Role "${roleStr}" mapped to "${mappings[roleStr]}"`);
    return mappings[roleStr];
  }
  
  // EVERYTHING ELSE becomes 'member' - absolutely no exceptions
  console.log(`🔧 Unknown role "${roleStr}", defaulting to member`);
  return 'member';
};

export function SimpleCSVUpload() {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
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
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return {
        email: row.email || '',
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        phone: row.phone || null,
        voice_part: row.voice_part || null,
        role: validateRole(row.role), // Validate role immediately
        status: row.status || 'active',
        class_year: row.class_year || null,
        notes: row.notes || null,
        dues_paid: row.dues_paid === 'true' || row.dues_paid === true,
        join_date: row.join_date || null
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setCsvData(parsed);
      
      console.log('🔧 Parsed CSV data:', parsed.map(row => ({ email: row.email, role: row.role })));
      
      toast.success(`CSV loaded with ${parsed.length} rows`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file');
    }
  };

  const createMemberImport = async (userData: CSVRow): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`🔧 Creating member import for: ${userData.email} with role: ${userData.role}`);

      // FINAL SAFETY CHECK: Ensure role is absolutely valid
      const safeRole = validateRole(userData.role);
      
      const profileData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        voice_part: userData.voice_part,
        role: safeRole, // Use the safe, validated role
        status: userData.status || 'active',
        class_year: userData.class_year,
        notes: userData.notes,
        dues_paid: userData.dues_paid === true,
        join_date: userData.join_date,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log(`🔧 FINAL PROFILE DATA for ${userData.email}:`, {
        role: profileData.role,
        originalRole: userData.role,
        isValidRole: VALID_ROLES.includes(profileData.role as ValidRole)
      });

      // Double-check that role is valid before inserting
      if (!VALID_ROLES.includes(profileData.role as ValidRole)) {
        console.error(`🚨 CRITICAL: Invalid role detected: "${profileData.role}" - forcing to member`);
        profileData.role = 'member';
      }

      const { error } = await supabase
        .from('member_imports')
        .insert({
          email: userData.email,
          profile_data: profileData,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error(`🔧 Insert error for ${userData.email}:`, error);
        throw error;
      }

      console.log(`✅ Success: Member import created for ${userData.email} with role "${profileData.role}"`);
      return { success: true };
    } catch (error: any) {
      console.error(`🔧 Error creating member import for ${userData.email}:`, error);
      return { 
        success: false, 
        error: error.message || 'Unknown error'
      };
    }
  };

  const processBulkUpload = async () => {
    if (csvData.length === 0) {
      toast.error('No data to process');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult({ success: 0, errors: [] });

    const results: UploadResult = { success: 0, errors: [] };

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
      
      // Validate required fields
      if (!row.email || !row.first_name || !row.last_name) {
        results.errors.push({
          row: i + 2, // +2 for header and 0-based index
          email: row.email || 'Unknown',
          error: 'Missing required fields (email, first_name, last_name)'
        });
        continue;
      }

      const result = await createMemberImport(row);
      
      if (result.success) {
        results.success++;
      } else {
        results.errors.push({
          row: i + 2,
          email: row.email,
          error: result.error || 'Unknown error'
        });
      }

      setUploadProgress(Math.round(((i + 1) / csvData.length) * 100));
      setUploadResult({ ...results });

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsUploading(false);
    toast.success(`Import completed! ${results.success} profiles queued for creation`);
  };

  const resetUpload = () => {
    setCsvData([]);
    setUploadResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Upload your CSV file</p>
              <p className="text-sm text-muted-foreground mb-4">
                Select a CSV file with member information
              </p>
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>

            {csvData.length > 0 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Ready to process:</strong> {csvData.length} members loaded
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {csvData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Process Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={processBulkUpload} disabled={isUploading}>
                  {isUploading ? 'Processing...' : 'Start Import'}
                </Button>
                <Button onClick={resetUpload} variant="outline" disabled={isUploading}>
                  Reset
                </Button>
              </div>

              {isUploading && (
                <div>
                  <Progress value={uploadProgress} className="mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {uploadProgress}% complete
                  </p>
                </div>
              )}

              {uploadResult && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{uploadResult.success} Successful</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span>{uploadResult.errors.length} Failed</span>
                    </div>
                  </div>

                  {uploadResult.errors.length > 0 && (
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {uploadResult.errors.map((error, index) => (
                        <div key={index} className="text-sm p-2 bg-red-50 border border-red-200 rounded">
                          <strong>Row {error.row}:</strong> {error.email} - {error.error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
