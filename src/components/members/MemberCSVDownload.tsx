import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Loader2, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExportOptions {
  includePersonalInfo: boolean;
  includeContactInfo: boolean;
  includeChoirInfo: boolean;
  includeAdminInfo: boolean;
  activeOnly: boolean;
}

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  voice_part: string | null;
  status: string | null;
  join_date: string | null;
  class_year: string | null;
  dues_paid: boolean | null;
  notes: string | null;
  role: string | null;
  is_super_admin: boolean | null;
}

interface AuthUser {
  id: string;
  email?: string;
}

export function MemberCSVDownload() {
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    includePersonalInfo: true,
    includeContactInfo: true,
    includeChoirInfo: true,
    includeAdminInfo: false,
    activeOnly: true,
  });

  const updateOption = (key: keyof ExportOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const exportToCSV = async () => {
    setIsExporting(true);
    
    try {
      console.log('🔄 Starting CSV export...');
      
      // Build the select query based on options
      let selectFields = ['id'];
      
      if (options.includePersonalInfo) {
        selectFields.push('first_name', 'last_name', 'join_date', 'class_year');
      }
      
      if (options.includeContactInfo) {
        selectFields.push('phone');
      }
      
      if (options.includeChoirInfo) {
        selectFields.push('voice_part', 'dues_paid');
      }
      
      if (options.includeAdminInfo) {
        selectFields.push('role', 'is_super_admin', 'status', 'notes');
      }

      // Query profiles using standard RLS policies
      let query = supabase
        .from('profiles')
        .select(selectFields.join(', '));

      if (options.activeOnly) {
        query = query.eq('status', 'active');
      }

      const { data: profiles, error: profilesError } = await query
        .order('last_name', { ascending: true });

      if (profilesError) {
        console.error('❌ Profiles query error:', profilesError);
        throw new Error(`Failed to fetch member data: ${profilesError.message}`);
      }

      console.log('✅ Profiles query successful:', profiles?.length || 0);

      // Get email addresses from auth users (for admins)
      let emails: { [key: string]: string } = {};
      if (options.includeContactInfo) {
        try {
          const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
          
          if (!authError && authData?.users) {
            authData.users.forEach((user: AuthUser) => {
              if (user.email && user.id) {
                emails[user.id] = user.email;
              }
            });
            console.log('📧 Email addresses fetched:', Object.keys(emails).length);
          } else {
            console.warn('⚠️ Could not fetch email addresses (admin access required)');
          }
        } catch (authError) {
          console.warn('⚠️ Could not fetch email addresses (admin access required)');
        }
      }

      // Check if we have valid profile data
      if (!profiles || profiles.length === 0) {
        toast.warning('No members found to export');
        return;
      }

      // Process profiles data - remove unsafe casting and handle data properly
      const processedProfiles = profiles.filter((profile): profile is ProfileData => {
        return profile && typeof profile === 'object' && 'id' in profile;
      });

      if (processedProfiles.length === 0) {
        toast.warning('No valid member data found to export');
        return;
      }

      // Build CSV headers
      const headers = ['ID'];
      
      if (options.includePersonalInfo) {
        headers.push('First Name', 'Last Name', 'Join Date', 'Class Year');
      }
      
      if (options.includeContactInfo) {
        headers.push('Email', 'Phone');
      }
      
      if (options.includeChoirInfo) {
        headers.push('Voice Part', 'Dues Paid');
      }
      
      if (options.includeAdminInfo) {
        headers.push('Role', 'Is Admin', 'Status', 'Notes');
      }

      // Build CSV rows
      const csvRows = processedProfiles.map((profile: ProfileData) => {
        const row = [profile.id];
        
        if (options.includePersonalInfo) {
          row.push(
            profile.first_name || '',
            profile.last_name || '',
            profile.join_date || '',
            profile.class_year || ''
          );
        }
        
        if (options.includeContactInfo) {
          row.push(
            emails[profile.id] || '',
            profile.phone || ''
          );
        }
        
        if (options.includeChoirInfo) {
          row.push(
            profile.voice_part || '',
            profile.dues_paid ? 'Yes' : 'No'
          );
        }
        
        if (options.includeAdminInfo) {
          row.push(
            profile.role || '',
            profile.is_super_admin ? 'Yes' : 'No',
            profile.status || '',
            profile.notes || ''
          );
        }
        
        return row;
      });

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => 
          row.map(cell => 
            typeof cell === 'string' && (cell.includes(',') || cell.includes('"')) 
              ? `"${cell.replace(/"/g, '""')}"` 
              : cell
          ).join(',')
        )
      ].join('\n');

      // Download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `members_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast.success(`Successfully exported ${processedProfiles.length} members`);
      
    } catch (error: any) {
      console.error('💥 Export error:', error);
      toast.error(error?.message || 'Failed to export members');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Member Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              Export member data to a CSV file. Select which information to include in the export.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-medium">Data to Include:</h4>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="personal"
                  checked={options.includePersonalInfo}
                  onCheckedChange={(checked) => updateOption('includePersonalInfo', checked as boolean)}
                />
                <label htmlFor="personal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Personal Information (Name, Join Date, Class Year)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact"
                  checked={options.includeContactInfo}
                  onCheckedChange={(checked) => updateOption('includeContactInfo', checked as boolean)}
                />
                <label htmlFor="contact" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contact Information (Email, Phone)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="choir"
                  checked={options.includeChoirInfo}
                  onCheckedChange={(checked) => updateOption('includeChoirInfo', checked as boolean)}
                />
                <label htmlFor="choir" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Choir Information (Voice Part, Dues Status)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="admin"
                  checked={options.includeAdminInfo}
                  onCheckedChange={(checked) => updateOption('includeAdminInfo', checked as boolean)}
                />
                <label htmlFor="admin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Administrative Information (Role, Status, Notes)
                </label>
              </div>
            </div>

            <hr />

            <h4 className="font-medium">Filter Options:</h4>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={options.activeOnly}
                onCheckedChange={(checked) => updateOption('activeOnly', checked as boolean)}
              />
              <label htmlFor="active" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Active Members Only
              </label>
            </div>
          </div>

          {!options.includePersonalInfo && !options.includeContactInfo && !options.includeChoirInfo && !options.includeAdminInfo && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select at least one data category to export.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={exportToCSV}
            disabled={isExporting || (!options.includePersonalInfo && !options.includeContactInfo && !options.includeChoirInfo && !options.includeAdminInfo)}
            className="w-full"
          >
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
