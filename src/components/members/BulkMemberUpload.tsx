
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, FileText, AlertCircle, CheckCircle, Download, File, Files } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

interface ParsedMember {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  voice_part?: string;
  role?: string;
  status?: string;
  class_year?: string;
  notes?: string;
  dues_paid?: string | boolean;
  join_date?: string;
}

interface UploadResult {
  success: number;
  errors: Array<{ row: number; email: string; error: string }>;
}

interface FileValidation {
  isValid: boolean;
  errors: string[];
  data?: ParsedMember[];
}

export function BulkMemberUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [parsedData, setParsedData] = useState<ParsedMember[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = [
    { ext: '.csv', desc: 'Comma Separated Values', icon: FileText },
    { ext: '.xlsx', desc: 'Excel Spreadsheet', icon: File },
    { ext: '.xls', desc: 'Excel 97-2003', icon: File },
    { ext: '.json', desc: 'JSON Array', icon: Files }
  ];

  const requiredFields = ['email', 'first_name', 'last_name'];
  const optionalFields = [
    'phone', 'voice_part', 'role', 'status', 'class_year', 
    'notes', 'dues_paid', 'join_date'
  ];

  const downloadTemplate = (format: 'csv' | 'xlsx' | 'json') => {
    const sampleData = [
      {
        email: 'example@spelman.edu',
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '555-0123',
        voice_part: 'soprano_1',
        role: 'member',
        status: 'active',
        class_year: '2025',
        notes: 'Sample notes',
        dues_paid: 'true',
        join_date: '2024-01-15'
      },
      {
        email: 'student@spelman.edu',
        first_name: 'Mary',
        last_name: 'Smith',
        phone: '555-0124',
        voice_part: 'alto_1',
        role: 'member',
        status: 'active',
        class_year: '2026',
        notes: 'Another member',
        dues_paid: 'false',
        join_date: '2024-02-01'
      }
    ];

    if (format === 'csv') {
      const headers = Object.keys(sampleData[0]).join(',');
      const rows = sampleData.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = `${headers}\n${rows}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'member_upload_template.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'xlsx') {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(sampleData);
      XLSX.utils.book_append_sheet(wb, ws, 'Members');
      XLSX.writeFile(wb, 'member_upload_template.xlsx');
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(sampleData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'member_upload_template.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const parseCSV = (text: string): ParsedMember[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return row as ParsedMember;
    });
  };

  const parseExcel = async (file: File): Promise<ParsedMember[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          if (jsonData.length < 2) {
            reject(new Error('File must contain at least a header row and one data row'));
            return;
          }
          
          const headers = (jsonData[0] as string[]).map(h => 
            h.toString().toLowerCase().trim().replace(/\s+/g, '_')
          );
          
          const members = (jsonData.slice(1) as any[][]).map(row => {
            const member: any = {};
            headers.forEach((header, index) => {
              member[header] = row[index]?.toString() || '';
            });
            return member as ParsedMember;
          });
          
          resolve(members);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const parseJSON = (text: string): ParsedMember[] => {
    const data = JSON.parse(text);
    if (!Array.isArray(data)) {
      throw new Error('JSON must contain an array of member objects');
    }
    return data;
  };

  const validateData = (data: ParsedMember[]): FileValidation => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('File contains no data rows');
      return { isValid: false, errors };
    }
    
    // Check for required fields in first row
    const firstRow = data[0];
    const missingRequired = requiredFields.filter(field => !firstRow.hasOwnProperty(field));
    if (missingRequired.length > 0) {
      errors.push(`Missing required columns: ${missingRequired.join(', ')}`);
    }
    
    // Validate each row
    data.forEach((row, index) => {
      const rowNum = index + 2; // Account for header row
      
      // Check required fields
      requiredFields.forEach(field => {
        if (!row[field as keyof ParsedMember] || row[field as keyof ParsedMember] === '') {
          errors.push(`Row ${rowNum}: Missing ${field}`);
        }
      });
      
      // Validate email format
      if (row.email && !row.email.includes('@')) {
        errors.push(`Row ${rowNum}: Invalid email format`);
      }
      
      // Validate voice part
      if (row.voice_part && !['soprano_1', 'soprano_2', 'alto_1', 'alto_2', 'tenor', 'bass'].includes(row.voice_part)) {
        errors.push(`Row ${rowNum}: Invalid voice part "${row.voice_part}"`);
      }
      
      // Validate role
      if (row.role && !['member', 'section_leader', 'admin'].includes(row.role)) {
        errors.push(`Row ${rowNum}: Invalid role "${row.role}"`);
      }
      
      // Validate status
      if (row.status && !['active', 'inactive', 'pending', 'alumni'].includes(row.status)) {
        errors.push(`Row ${rowNum}: Invalid status "${row.status}"`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      data: errors.length === 0 ? data : undefined
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setParsedData([]);
    setValidationErrors([]);
    setUploadResult(null);

    try {
      let parsed: ParsedMember[] = [];
      
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        parsed = parseCSV(text);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        parsed = await parseExcel(file);
      } else if (file.name.endsWith('.json')) {
        const text = await file.text();
        parsed = parseJSON(text);
      } else {
        toast.error('Unsupported file format. Please use CSV, Excel, or JSON.');
        return;
      }

      const validation = validateData(parsed);
      
      if (validation.isValid && validation.data) {
        setParsedData(validation.data);
        toast.success(`Successfully parsed ${validation.data.length} members`);
      } else {
        setValidationErrors(validation.errors);
        toast.error(`Validation failed: ${validation.errors.length} errors found`);
      }
    } catch (error) {
      console.error('File parsing error:', error);
      toast.error('Failed to parse file. Please check the format and try again.');
    }
  };

  const createUser = async (userData: ParsedMember): Promise<void> => {
    const tempPassword = `Temp${Math.random().toString(36).substring(2, 8)}Glee!1`;
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name
      }
    });

    if (authError) throw new Error(`Failed to create auth user: ${authError.message}`);
    if (!authData.user?.id) throw new Error('User creation failed - no user ID returned');

    const duesPaid = typeof userData.dues_paid === 'string' 
      ? userData.dues_paid.toLowerCase() === 'true'
      : Boolean(userData.dues_paid);
    
    const joinDate = userData.join_date || new Date().toISOString().split('T')[0];

    const profileData = {
      id: authData.user.id,
      first_name: userData.first_name,
      last_name: userData.last_name,
      phone: userData.phone || null,
      voice_part: userData.voice_part || null,
      status: userData.status || 'active',
      class_year: userData.class_year || null,
      notes: userData.notes || null,
      dues_paid: duesPaid,
      join_date: joinDate,
      role: userData.role || 'member',
      is_super_admin: userData.role === 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id', ignoreDuplicates: false });

    if (profileError) {
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }
      throw new Error(`Failed to create profile: ${profileError.message}`);
    }
  };

  const handleBulkUpload = async () => {
    if (parsedData.length === 0) {
      toast.error('No valid data to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const result: UploadResult = { success: 0, errors: [] };
    const batchSize = 5;
    const batchDelay = 3000;
    const userDelay = 500;

    try {
      for (let batchStart = 0; batchStart < parsedData.length; batchStart += batchSize) {
        const batchEnd = Math.min(batchStart + batchSize, parsedData.length);
        const batch = parsedData.slice(batchStart, batchEnd);
        
        for (let i = 0; i < batch.length; i++) {
          const globalIndex = batchStart + i;
          const member = batch[i];
          setUploadProgress(((globalIndex + 1) / parsedData.length) * 100);

          try {
            await createUser(member);
            result.success++;
          } catch (error: any) {
            result.errors.push({
              row: globalIndex + 2,
              email: member.email,
              error: error.message || 'Unknown error occurred'
            });
          }

          if (i < batch.length - 1) {
            await new Promise(resolve => setTimeout(resolve, userDelay));
          }
        }

        if (batchEnd < parsedData.length) {
          await new Promise(resolve => setTimeout(resolve, batchDelay));
        }
      }
    } finally {
      setUploadResult(result);
      setIsUploading(false);
      setParsedData([]);
      setSelectedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (result.success > 0) {
        toast.success(`Successfully created ${result.success} members`);
      }
      
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} members failed to create`);
      }
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
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload members from various file formats. Supported: CSV, Excel (.xlsx/.xls), and JSON.
              Required fields: email, first_name, last_name.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="templates">Download Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="bulk-upload"
                />
                <label htmlFor="bulk-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Click to select a file or drag and drop
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {supportedFormats.map((format) => (
                        <Badge key={format.ext} variant="outline" className="text-xs">
                          {format.ext}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </label>
              </div>

              {selectedFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supportedFormats.map((format) => (
                  <Card key={format.ext} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <format.icon className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{format.ext.toUpperCase()}</h3>
                        <p className="text-xs text-gray-500">{format.desc}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTemplate(format.ext.slice(1) as 'csv' | 'xlsx' | 'json')}
                      className="w-full"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      Download
                    </Button>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Field Specifications:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-green-600 mb-1">Required Fields:</p>
                    <ul className="space-y-1">
                      {requiredFields.map(field => (
                        <li key={field} className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-blue-600 mb-1">Optional Fields:</p>
                    <ul className="space-y-1">
                      {optionalFields.map(field => (
                        <li key={field} className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Validation Errors ({validationErrors.length}):</p>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {validationErrors.slice(0, 10).map((error, index) => (
                      <p key={index} className="text-xs">{error}</p>
                    ))}
                    {validationErrors.length > 10 && (
                      <p className="text-xs italic">...and {validationErrors.length - 10} more errors</p>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {parsedData.length} members ready for upload. All validation checks passed.
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
            onClick={handleBulkUpload}
            disabled={isUploading || parsedData.length === 0}
            className="w-full"
          >
            {isUploading ? 'Uploading...' : `Upload ${parsedData.length} Members`}
          </Button>
        </CardContent>
      </Card>

      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{uploadResult.success}</p>
                  <p className="text-sm text-green-700">Successfully Created</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">{uploadResult.errors.length}</p>
                  <p className="text-sm text-red-700">Failed</p>
                </div>
              </div>

              {uploadResult.errors.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Failed Members:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 bg-red-50 p-3 rounded">
                    {uploadResult.errors.map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        <span className="font-medium">{error.email}:</span> {error.error}
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
