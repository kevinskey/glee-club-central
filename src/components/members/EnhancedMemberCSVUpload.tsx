import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle, CheckCircle, Download, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

// These are the ONLY valid role values according to the database constraint
const VALID_ROLES = ['admin', 'member', 'section_leader'];

// Comprehensive role mapping - EVERYTHING maps to one of the 3 valid values
const ROLE_MAPPING: { [key: string]: string } = {
  // Direct valid roles
  'admin': 'member',
  'administrator': 'member',
  'member': 'member',
  'section_leader': 'member',
  'section leader': 'member',
  'leader': 'member',
  
  // All possible variations should map to 'member' (safest default)
  'student': 'member',
  'singer': 'member',
  'general member': 'member',
  'regular member': 'member',
  'user': 'member',
  'standard': 'member',
  'basic': 'member',
  'regular': 'member',
  'default': 'member',
  'alumni': 'member',
  'alumna': 'member',
  'alum': 'member',
  'guest': 'member',
  'visitor': 'member',
  'fan': 'member',
  'supporter': 'member',
  'active': 'member',
  'inactive': 'member',
  'pending': 'member',
  'new': 'member',
  'current': 'member',
  'former': 'member',
  'participant': 'member',
  'attendee': 'member',
  'registered': 'member',
  'enrolled': 'member',
  'performer': 'member',
  'vocalist': 'member',
  'choir member': 'member',
  'glee member': 'member',
  'president': 'member',
  'vice president': 'member',
  'secretary': 'member',
  'treasurer': 'member',
  'historian': 'member',
  'librarian': 'member',
  'business manager': 'member',
  'social chair': 'member',
  'publicity': 'member',
  'officer': 'member',
  'executive': 'member',
  // Empty or null-like values
  '': 'member',
  'null': 'member',
  'undefined': 'member',
  'none': 'member',
  ' ': 'member',
  'n/a': 'member',
  'na': 'member',
  'not specified': 'member',
  'tbd': 'member',
  'to be determined': 'member'
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

  const normalizeVoicePart = (section: string): string => {
    if (!section) return '';
    const normalized = section.toLowerCase().trim();
    return VOICE_PART_MAPPING[normalized] || section;
  };

  const normalizeRole = (role: any): string => {
    // Handle absolutely any input type
    if (role === null || role === undefined) {
      console.log('🔧 ROLE DEBUG: Null/undefined role, defaulting to member');
      return 'member';
    }
    
    // Convert to string and handle all whitespace/empty cases
    const roleString = String(role).toLowerCase().trim();
    
    // Handle empty string variations
    if (!roleString || roleString === '' || roleString === 'null' || roleString === 'undefined') {
      console.log('🔧 ROLE DEBUG: Empty role string, defaulting to member');
      return 'member';
    }
    
    // Check our comprehensive mapping
    if (ROLE_MAPPING.hasOwnProperty(roleString)) {
      const mappedRole = ROLE_MAPPING[roleString];
      console.log(`🔧 ROLE DEBUG: "${role}" (normalized: "${roleString}") mapped to "${mappedRole}"`);
      return mappedRole;
    }
    
    // If no mapping found, ALWAYS default to member and log it
    console.warn(`🔧 ROLE DEBUG: Unknown role "${role}" (normalized: "${roleString}"), defaulting to "member"`);
    return 'member';
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
      
      // Auto-map obvious columns
      const autoMapping: ColumnMapping = {};
      columns.forEach(col => {
        const headerLower = col.header.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const field = SYSTEM_FIELDS.find(f => 
          f.key === headerLower || 
          f.label.toLowerCase().replace(/[^a-z0-9]/g, '_') === headerLower ||
          (f.key === 'voice_part' && ['voice_part', 'section', 'part'].includes(headerLower)) ||
          (f.key === 'class_year' && ['class_year', 'graduation_year', 'year'].includes(headerLower))
        );
        if (field) {
          autoMapping[col.header] = field.key;
        }
      });

      setColumnMapping(autoMapping);
      setStep('map');
      toast.success(`CSV loaded with ${parsed.length - 1} rows`);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file');
    }
  };

  const validateMapping = (): boolean => {
    const requiredFields = SYSTEM_FIELDS.filter(f => f.required);
    const mappedFields = Object.values(columnMapping).filter(Boolean);
    
    for (const field of requiredFields) {
      if (!mappedFields.includes(field.key)) {
        toast.error(`Required field "${field.label}" must be mapped`);
        return false;
      }
    }
    return true;
  };

  const mapRowData = (row: string[], rowIndex: number): MappedRow | null => {
    try {
      const mappedData: any = {};
      
      Object.entries(columnMapping).forEach(([csvColumn, systemField]) => {
        if (systemField) {
          const columnIndex = csvColumns.findIndex(col => col.header === csvColumn);
          if (columnIndex !== -1) {
            let value = row[columnIndex]?.trim() || '';
            
            // Handle special field transformations
            if (systemField === 'voice_part') {
              value = normalizeVoicePart(value);
            } else if (systemField === 'role') {
              const originalValue = value;
              value = normalizeRole(value);
              console.log(`🔧 ROW ${rowIndex}: Role transformation: "${originalValue}" → "${value}"`);
            } else if (systemField === 'dues_paid') {
              value = value.toLowerCase() === 'true' || value === '1' ? 'true' : 'false';
            } else if (systemField === 'status' && !value) {
              value = 'active';
            }
            
            mappedData[systemField] = value;
          }
        }
      });

      // Validate required fields
      if (!mappedData.email || !mappedData.first_name || !mappedData.last_name) {
        throw new Error('Missing required fields');
      }

      // CRITICAL: Ensure role is ALWAYS set to a valid value
      if (!mappedData.role) {
        console.warn(`🔧 ROW ${rowIndex}: No role specified for ${mappedData.email}, setting to "member"`);
        mappedData.role = 'member';
      }

      // FINAL VALIDATION: Absolutely ensure the role is valid
      if (!VALID_ROLES.includes(mappedData.role)) {
        console.error(`🔧 CRITICAL ERROR ROW ${rowIndex}: Invalid role "${mappedData.role}" for ${mappedData.email}. This should never happen!`);
        mappedData.role = 'member';
      }

      console.log(`🔧 ROW ${rowIndex} FINAL DATA for ${mappedData.email}:`, {
        role: mappedData.role,
        isValidRole: VALID_ROLES.includes(mappedData.role),
        validRolesList: VALID_ROLES
      });

      return mappedData as MappedRow;
    } catch (error) {
      console.error(`🔧 ERROR mapping row ${rowIndex}:`, error);
      return null;
    }
  };

  const createProfile = async (userData: MappedRow): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log(`🔧 CREATING PROFILE for: ${userData.email}`);

      // ULTIMATE ROLE VALIDATION - this is our last line of defense
      let safeRole = userData.role || 'member';
      
      // Normalize one more time to be absolutely sure
      safeRole = normalizeRole(safeRole);
      
      // Final check - if it's still not valid, force it to 'member'
      if (!VALID_ROLES.includes(safeRole)) {
        console.error(`🔧 FINAL SAFETY CHECK FAILED: Role "${safeRole}" is not valid. Forcing to "member"`);
        safeRole = 'member';
      }

      const profileData = {
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone || null,
        voice_part: userData.voice_part || null,
        role: safeRole, // Use the ultra-safe role
        status: userData.status || 'active',
        class_year: userData.class_year || null,
        notes: userData.notes || null,
        dues_paid: userData.dues_paid === 'true',
        join_date: userData.join_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Log everything for debugging
      console.log(`🔧 FINAL PROFILE DATA for ${userData.email}:`, {
        originalRole: userData.role,
        safeRole: safeRole,
        isValidRole: VALID_ROLES.includes(safeRole),
        validRoles: VALID_ROLES,
        profileDataRole: profileData.role
      });

      // Insert into member_imports table
      const { error: insertError } = await supabase
        .from('member_imports')
        .insert({
          email: userData.email,
          profile_data: profileData,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error(`🔧 INSERT ERROR for ${userData.email}:`, {
          error: insertError,
          profileData: profileData,
          roleValue: profileData.role,
          roleType: typeof profileData.role
        });
        throw insertError;
      }

      console.log(`✅ SUCCESS: Created member import for ${userData.email} with role "${profileData.role}"`);
      return { success: true };
    } catch (error: any) {
      console.error(`🔧 PROFILE CREATION ERROR for ${userData.email}:`, {
        error: error,
        errorMessage: error.message,
        errorDetails: error.details,
        originalRole: userData.role
      });
      return { 
        success: false, 
        error: `${error.message || 'Unknown error'}${error.details ? ` (${error.details})` : ''}` 
      };
    }
  };

  const processBulkUpload = async () => {
    if (!validateMapping()) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadResult({ success: 0, errors: [] });
    setStep('preview');

    const dataRows = csvData.slice(1); // Skip header row
    const results: UploadResult = { success: 0, errors: [] };

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const mappedData = mapRowData(row, i + 2); // +2 for header and 0-based index

      if (!mappedData) {
        results.errors.push({
          row: i + 2,
          email: row[0] || 'Unknown',
          error: 'Failed to map row data'
        });
        continue;
      }

      const result = await createProfile(mappedData);
      
      if (result.success) {
        results.success++;
      } else {
        results.errors.push({
          row: i + 2,
          email: mappedData.email,
          error: result.error || 'Unknown error'
        });
      }

      setUploadProgress(Math.round(((i + 1) / dataRows.length) * 100));
      setUploadResult({ ...results });

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsUploading(false);
    setStep('complete');
    
    toast.success(`Import completed! ${results.success} profiles queued for creation`);
  };

  const resetUpload = () => {
    setStep('upload');
    setCsvData([]);
    setCsvColumns([]);
    setColumnMapping({});
    setUploadResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (step === 'upload') {
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
                <Button onClick={handleFileSelect}>
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> This feature creates member profiles that will need to be manually activated. 
                  The actual user accounts must be created through Supabase admin panel or invitation system.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'map') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Map CSV Columns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Map your CSV columns to the system fields. Required fields are marked with *.
              </p>
              
              <div className="grid gap-4">
                {csvColumns.map((column) => (
                  <div key={column.index} className="flex items-center gap-4 p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{column.header}</div>
                      <div className="text-sm text-muted-foreground">
                        Sample: {column.sample || 'No data'}
                      </div>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    
                    <div className="flex-1">
                      <Select
                        value={columnMapping[column.header] || ''}
                        onValueChange={(value) => 
                          setColumnMapping(prev => ({
                            ...prev,
                            [column.header]: value || null
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Don't map</SelectItem>
                          {SYSTEM_FIELDS.map((field) => (
                            <SelectItem key={field.key} value={field.key}>
                              {field.label}{field.required && ' *'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={resetUpload} variant="outline">
                  Cancel
                </Button>
                <Button onClick={processBulkUpload}>
                  Start Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Import...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={uploadProgress} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {uploadProgress}% complete
            </p>
          </CardContent>
        </Card>
      )}

      {uploadResult && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
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

              <div className="flex gap-2">
                <Button onClick={resetUpload} variant="outline">
                  Import Another File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
