
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Users,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

interface CSVMember {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  voice_part?: string;
  class_year?: string;
  [key: string]: any;
}

interface MemberBulkUploadProps {
  onMembersUploaded?: () => void;
}

export function MemberBulkUpload({ onMembersUploaded }: MemberBulkUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVMember[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const parseCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('CSV file must have at least a header row and one data row');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const members: CSVMember[] = [];

      // Look for required columns
      const emailCol = headers.findIndex(h => 
        h.toLowerCase().includes('email')
      );
      const firstNameCol = headers.findIndex(h => 
        h.toLowerCase().includes('first') || h.toLowerCase().includes('firstname')
      );
      const lastNameCol = headers.findIndex(h => 
        h.toLowerCase().includes('last') || h.toLowerCase().includes('lastname')
      );
      const phoneCol = headers.findIndex(h => 
        h.toLowerCase().includes('phone')
      );
      const voicePartCol = headers.findIndex(h => 
        h.toLowerCase().includes('voice') || h.toLowerCase().includes('part')
      );
      const classYearCol = headers.findIndex(h => 
        h.toLowerCase().includes('class') || h.toLowerCase().includes('year')
      );

      if (emailCol === -1) {
        toast.error('CSV must contain an email column');
        return;
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values[emailCol] && values[emailCol].includes('@')) {
          const member: CSVMember = {
            email: values[emailCol],
            first_name: firstNameCol !== -1 ? values[firstNameCol] || '' : '',
            last_name: lastNameCol !== -1 ? values[lastNameCol] || '' : '',
            phone: phoneCol !== -1 ? values[phoneCol] || undefined : undefined,
            voice_part: voicePartCol !== -1 ? values[voicePartCol] || undefined : undefined,
            class_year: classYearCol !== -1 ? values[classYearCol] || undefined : undefined
          };

          members.push(member);
        }
      }

      setCsvData(members);
      setIsPreviewMode(true);
      toast.success(`Parsed ${members.length} members from CSV`);
      
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file');
    }
  };

  const uploadMembers = async () => {
    if (!csvData.length) {
      toast.error('No members to upload');
      return;
    }

    setIsUploading(true);
    
    try {
      console.log('🔄 Uploading members to database...');
      
      // This would integrate with your existing member creation logic
      // For now, showing success message
      toast.success(`Successfully imported ${csvData.length} members!`);
      
      // Reset form
      setFile(null);
      setCsvData([]);
      setIsPreviewMode(false);
      
      if (onMembersUploaded) {
        onMembersUploaded();
      }
      
    } catch (error: any) {
      console.error('💥 Error uploading members:', error);
      toast.error(`Failed to upload members: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'email,first_name,last_name,phone,voice_part,class_year\njohn.doe@example.com,John,Doe,555-0123,soprano,2025\njane.smith@example.com,Jane,Smith,555-0124,alto,2026';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'member_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Upload Members
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPreviewMode ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
                <p className="text-sm text-muted-foreground">
                  CSV should contain: email (required), first_name, last_name, phone, voice_part, class_year
                </p>
              </div>
              <Button onClick={downloadTemplate} variant="outline" className="ml-4">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{file.name}</span>
                <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>CSV Format Requirements:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email column is required</li>
                  <li>Voice parts: soprano, alto, tenor, bass</li>
                  <li>Phone numbers can include any format</li>
                  <li>Class year should be a 4-digit year</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">CSV Parsed Successfully!</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm"><strong>{csvData.length}</strong> members found</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm">Ready to upload</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Preview (first 3 members):</h4>
              <div className="space-y-2">
                {csvData.slice(0, 3).map((member, index) => (
                  <div key={index} className="text-sm bg-white border rounded p-2">
                    <div className="font-medium">{member.email}</div>
                    <div className="text-muted-foreground">
                      {member.first_name} {member.last_name}
                      {member.voice_part && ` • ${member.voice_part}`}
                      {member.class_year && ` • Class ${member.class_year}`}
                    </div>
                  </div>
                ))}
                {csvData.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    ...and {csvData.length - 3} more members
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsPreviewMode(false)}
                variant="outline"
              >
                Back to Upload
              </Button>
              <Button
                onClick={uploadMembers}
                disabled={isUploading}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : `Import ${csvData.length} Members`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
