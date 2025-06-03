import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useUserCreate } from '@/hooks/user/useUserCreate';
import { UserFormValues } from '@/components/members/form/userFormSchema';

interface CSVColumn {
  index: number;
  header: string;
  sample?: string;
}

interface ColumnMapping {
  [csvColumn: string]: string | null;
}

interface MappedRow {
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

const SYSTEM_FIELDS = [
  { key: 'email', label: 'Email Address', required: true },
  { key: 'first_name', label: 'First Name', required: true },
  { key: 'last_name', label: 'Last Name', required: true },
  { key: 'phone', label: 'Phone Number', required: false },
  { key: 'voice_part', label: 'Voice Part/Section', required: false },
  { key: 'role', label: 'Role', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'class_year', label: 'Class Year', required: false },
  { key: 'notes', label: 'Notes', required: false },
  { key: 'dues_paid', label: 'Dues Paid', required: false },
  { key: 'join_date', label: 'Join Date', required: false },
];

const VOICE_PART_MAPPING: { [key: string]: string } = {
  'soprano 1': 'soprano_1',
  'soprano1': 'soprano_1',
  's1': 'soprano_1',
  'soprano 2': 'soprano_2',
  'soprano2': 'soprano_2',
  's2': 'soprano_2',
  'alto 1': 'alto_1',
  'alto1': 'alto_1',
  'a1': 'alto_1',
  'alto 2': 'alto_2',
  'alto2': 'alto_2',
  'a2': 'alto_2',
  'tenor': 'tenor',
  'bass': 'bass',
};

export function EnhancedMemberCSVUpload() {
  const [csvColumns, setCsvColumns] = useState<CSVColumn[]>([]);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'complete'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use the hook to get the addUser function
  const { addUser } = useUserCreate();

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

  const parseCSV = (text: string): string[][] => {
    const lines = text.trim().split('\n');
    return lines.map(line => {
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());
      return values;
    });
  };

  const convertBirthdayToJoinDate = (birthday: string): string => {
    if (!birthday) return '';
    
    // Handle MM/DD/YYYY format
    const parts = birthday.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      // Convert to YYYY-MM-DD format, but use current year for join date
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return '';
  };

  const normalizeVoicePart = (section: string): string => {
    if (!section) return '';
    const normalized = section.toLowerCase().trim();
    return VOICE_PART_MAPPING[normalized] || section;
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
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
      
      if (parsed.length === 0) {
        toast.error('CSV file is empty');
        return;
      }

      const headers = parsed[0];
      const sampleRow = parsed[1] || [];
      
      const columns = headers.map((header, index) => ({
        index,
        header: header.trim(),
        sample: sampleRow[index] || ''
      }));

      setCsvColumns(columns);
      
      // Auto-map obvious columns with more flexible matching
      const autoMapping: ColumnMapping = {};
      columns.forEach(col => {
        const header = col.header.toLowerCase().trim();
        
        // Map common variations
        if (header.includes('first') && header.includes('name') || header === 'first name') {
          autoMapping[col.header] = 'first_name';
        } else if (header.includes('last') && header.includes('name') || header === 'last name') {
          autoMapping[col.header] = 'last_name';
        } else if (header === 'email') {
          autoMapping[col.header] = 'email';
        } else if (header === 'number' || header.includes('phone')) {
          autoMapping[col.header] = 'phone';
        } else if (header === 'section') {
          autoMapping[col.header] = 'voice_part';
        } else if (header.includes('birthday')) {
          autoMapping[col.header] = 'join_date';
        }
      });

      setColumnMapping(autoMapping);
      setStep('map');
      toast.success(`Loaded ${parsed.length - 1} rows from CSV`);
    } catch (error) {
      toast.error('Failed to parse CSV file');
      console.error('CSV parsing error:', error);
    }
  };

  const handleMappingChange = (csvColumn: string, systemField: string | null) => {
    setColumnMapping(prev => ({
      ...prev,
      [csvColumn]: systemField
    }));
  };

  const validateMapping = (): string[] => {
    const errors = [];
    const requiredFields = SYSTEM_FIELDS.filter(f => f.required).map(f => f.key);
    const mappedFields = Object.values(columnMapping).filter(Boolean);
    
    for (const required of requiredFields) {
      if (!mappedFields.includes(required)) {
        const field = SYSTEM_FIELDS.find(f => f.key === required);
        errors.push(`Required field "${field?.label}" is not mapped`);
      }
    }
    
    return errors;
  };

  const proceedToPreview = () => {
    const errors = validateMapping();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }
    setStep('preview');
  };

  const transformRow = (row: string[], index: number): MappedRow | null => {
    const mapped: any = {};
    
    Object.entries(columnMapping).forEach(([csvColumn, systemField]) => {
      if (systemField) {
        const colIndex = csvColumns.find(c => c.header === csvColumn)?.index;
        if (colIndex !== undefined && row[colIndex]) {
          let value = row[colIndex].trim();
          
          // Special transformations
          if (systemField === 'voice_part') {
            value = normalizeVoicePart(value);
          } else if (systemField === 'join_date') {
            value = convertBirthdayToJoinDate(value);
          } else if (systemField === 'dues_paid') {
            value = value.toLowerCase() === 'true' ? 'true' : 'false';
          } else if (systemField === 'status' && !value) {
            value = 'active';
          } else if (systemField === 'role' && !value) {
            value = 'member';
          } else if (systemField === 'email') {
            // Ensure email is properly formatted and normalized
            value = value.toLowerCase().trim();
            console.log('Processing email:', value);
          }
          
          mapped[systemField] = value;
        }
      }
    });

    // Validate required fields
    if (!mapped.email || !mapped.first_name || !mapped.last_name) {
      console.error('Missing required fields for row:', mapped);
      return null;
    }

    console.log('Mapped row data:', mapped);
    return mapped as MappedRow;
  };

  const createUser = async (userData: MappedRow): Promise<void> => {
    try {
      console.log('Creating user with email:', userData.email);
      
      // Validate email format before proceeding
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error(`Invalid email format: ${userData.email}`);
      }

      // Validate and transform voice_part to match enum
      const validVoicePart = userData.voice_part && 
        ['soprano_1', 'soprano_2', 'alto_1', 'alto_2', 'tenor', 'bass', 'director'].includes(userData.voice_part) 
        ? userData.voice_part as UserFormValues['voice_part']
        : null;

      // Validate and transform role to match enum  
      const validRole = userData.role && 
        ['admin', 'member', 'section_leader'].includes(userData.role)
        ? userData.role as UserFormValues['role']
        : 'member';

      // Validate and transform status to match enum
      const validStatus = userData.status &&
        ['active', 'pending', 'inactive', 'alumni'].includes(userData.status)
        ? userData.status as UserFormValues['status']
        : 'active';

      // Transform the data to match UserFormValues interface
      const userFormData: UserFormValues = {
        email: userData.email.toLowerCase().trim(), // Ensure email is normalized
        password: `Temp${Math.random().toString(36).substring(2, 8)}Glee!1`,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || '',
        voice_part: validVoicePart,
        role: validRole,
        status: validStatus,
        class_year: userData.class_year || '',
        notes: userData.notes || '',
        dues_paid: userData.dues_paid?.toLowerCase() === 'true',
        join_date: userData.join_date || new Date().toISOString().split('T')[0],
        is_admin: validRole === 'admin'
      };

      console.log('Submitting user form data:', userFormData);

      // Create user using the existing hook
      const success = await addUser(userFormData);
      
      if (!success) {
        throw new Error('Failed to create user');
      }
    } catch (error: any) {
      console.error('Error in createUser:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    const dataRows = csvData.slice(1); // Skip header row
    if (dataRows.length === 0) {
      toast.error('No data rows to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult(null);

    const result: UploadResult = { success: 0, errors: [] };
    const batchSize = 3; // Process 3 users at a time
    const batchDelay = 10000; // 10 second delay between batches
    const userDelay = 2000; // 2 second delay between individual users

    console.log(`Starting batch upload of ${dataRows.length} users in batches of ${batchSize}`);

    // Process users in batches
    for (let batchStart = 0; batchStart < dataRows.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, dataRows.length);
      const batch = dataRows.slice(batchStart, batchEnd);
      
      console.log(`Processing batch ${Math.floor(batchStart / batchSize) + 1}: users ${batchStart + 1}-${batchEnd}`);

      // Process each user in the current batch
      for (let i = 0; i < batch.length; i++) {
        const globalIndex = batchStart + i;
        const row = batch[i];
        setUploadProgress(((globalIndex + 1) / dataRows.length) * 100);

        try {
          const mappedData = transformRow(row, globalIndex);
          if (!mappedData || !mappedData.email || !mappedData.first_name || !mappedData.last_name) {
            result.errors.push({
              row: globalIndex + 2,
              email: mappedData?.email || 'Unknown',
              error: 'Missing required fields'
            });
            continue;
          }

          await createUser(mappedData);
          result.success++;
          console.log(`Successfully created user ${result.success}: ${mappedData.email}`);
        } catch (error: any) {
          console.error(`Failed to create user in row ${globalIndex + 2}:`, error);
          result.errors.push({
            row: globalIndex + 2,
            email: row[csvColumns.find(c => columnMapping[c.header] === 'email')?.index || 0] || 'Unknown',
            error: error.message || 'Unknown error'
          });
        }

        // Delay between individual users within the batch
        if (i < batch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, userDelay));
        }
      }

      // Longer delay between batches (except for the last batch)
      if (batchEnd < dataRows.length) {
        console.log(`Batch complete. Waiting ${batchDelay}ms before next batch to avoid rate limits...`);
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }

    console.log('Upload completed:', result);
    setUploadResult(result);
    setIsUploading(false);
    setStep('complete');

    if (result.success > 0) {
      toast.success(`Successfully created ${result.success} members`);
    }
    if (result.errors.length > 0) {
      toast.error(`${result.errors.length} members failed to create`);
    }
  };

  const resetUpload = () => {
    setStep('upload');
    setCsvColumns([]);
    setCsvData([]);
    setColumnMapping({});
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Member CSV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Upload your member list CSV. The system will help you map your columns to the required fields.
              </AlertDescription>
            </Alert>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={handleFileSelect}
              >
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Click to select your CSV file</p>
                  <p className="text-sm text-gray-500">
                    Supports files with columns like: First name, Last name, Email, Number, Section, etc.
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={handleFileSelect} className="w-full max-w-sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose CSV File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'map' && (
        <Card>
          <CardHeader>
            <CardTitle>Map Your Columns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Map your CSV columns to the system fields. Required fields must be mapped.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {csvColumns.map((column) => (
                <div key={column.index} className="flex items-center gap-4 p-3 border rounded">
                  <div className="flex-1">
                    <div className="font-medium">{column.header}</div>
                    {column.sample && (
                      <div className="text-sm text-gray-500">Sample: {column.sample}</div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex-1">
                    <Select
                      value={columnMapping[column.header] || 'none'}
                      onValueChange={(value) => handleMappingChange(column.header, value === 'none' ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select system field..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Don't map</SelectItem>
                        {SYSTEM_FIELDS.map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label} {field.required && '*'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={resetUpload} variant="outline">
                Start Over
              </Button>
              <Button onClick={proceedToPreview}>
                Continue to Preview
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Ready to upload {csvData.length - 1} members. Review the mapping and proceed.
              </AlertDescription>
            </Alert>

            <div className="text-sm space-y-1">
              <div><strong>Mapped fields:</strong></div>
              {Object.entries(columnMapping)
                .filter(([_, systemField]) => systemField)
                .map(([csvCol, systemField]) => (
                  <div key={csvCol} className="ml-4">
                    {csvCol} → {SYSTEM_FIELDS.find(f => f.key === systemField)?.label}
                  </div>
                ))}
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading members...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => setStep('map')} variant="outline">
                Back to Mapping
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : `Upload ${csvData.length - 1} Members`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Complete</CardTitle>
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
                        Row {error.row} ({error.email}): {error.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button onClick={resetUpload} className="mt-4">
              Upload Another File
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
