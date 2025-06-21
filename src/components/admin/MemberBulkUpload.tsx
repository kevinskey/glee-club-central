import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Download,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CSVMember {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  voice_part?: string;
  class_year?: string;
  role?: string;
  status?: string;
  notes?: string;
  dues_paid?: string;
  join_date?: string;
  title?: string;
  account_balance?: string;
  avatar_url?: string;
  special_roles?: string;
  role_tags?: string;
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
  const [uploadResults, setUploadResults] = useState<{
    success: number;
    failed: number;
    rateLimited: number;
    errors: Array<{ email: string; error: string }>;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      parseCSV(selectedFile);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const parseCSV = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        toast.error(
          "CSV file must have at least a header row and one data row",
        );
        return;
      }

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      const members: CSVMember[] = [];

      // Look for required columns
      const emailCol = headers.findIndex((h) =>
        h.toLowerCase().includes("email"),
      );
      const firstNameCol = headers.findIndex(
        (h) =>
          h.toLowerCase().includes("first") ||
          h.toLowerCase().includes("firstname"),
      );
      const lastNameCol = headers.findIndex(
        (h) =>
          h.toLowerCase().includes("last") ||
          h.toLowerCase().includes("lastname"),
      );

      if (emailCol === -1) {
        toast.error("CSV must contain an email column");
        return;
      }

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i]
          .split(",")
          .map((v) => v.trim().replace(/"/g, ""));

        if (values[emailCol] && values[emailCol].includes("@")) {
          const member: CSVMember = {
            email: values[emailCol],
            first_name: firstNameCol !== -1 ? values[firstNameCol] || "" : "",
            last_name: lastNameCol !== -1 ? values[lastNameCol] || "" : "",
          };

          // Add any additional columns as member fields
          headers.forEach((header, index) => {
            if (
              index !== emailCol &&
              index !== firstNameCol &&
              index !== lastNameCol
            ) {
              const fieldName = header.toLowerCase().replace(/\s+/g, "_");
              member[fieldName] = values[index] || "";
            }
          });

          members.push(member);
        }
      }

      setCsvData(members);
      setIsPreviewMode(true);
      toast.success(`Parsed ${members.length} members from CSV`);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Failed to parse CSV file");
    }
  };

  const createUserWithRetry = async (
    memberData: CSVMember,
    retryCount = 0,
  ): Promise<{ success: boolean; error?: string; rateLimited?: boolean }> => {
    const maxRetries = 3;
    const baseDelay = 2000;

    try {
      // Generate a secure temporary password
      const tempPassword = `Temp${Math.random().toString(36).substring(2, 8)}Glee!${new Date().getFullYear()}`;

      console.log(
        `Creating user (attempt ${retryCount + 1}):`,
        memberData.email,
      );

      // Create auth user using the signUp method with rate limiting handling
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: memberData.email,
        password: tempPassword,
        options: {
          emailRedirectTo: undefined, // Disable email confirmation to avoid rate limits
          data: {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
          },
        },
      });

      if (authError) {
        // Check if it's a rate limit error
        if (
          authError.message.includes("rate limit") ||
          authError.message.includes("429")
        ) {
          if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(2, retryCount);
            console.log(
              `Rate limit hit, retrying in ${delay}ms for ${memberData.email}...`,
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            return await createUserWithRetry(memberData, retryCount + 1);
          } else {
            return {
              success: false,
              rateLimited: true,
              error: "Rate limit exceeded after retries",
            };
          }
        }

        if (authError.message.includes("User already registered")) {
          return { success: false, error: "User already exists" };
        }

        return { success: false, error: authError.message };
      }

      if (!authData.user?.id) {
        return {
          success: false,
          error: "User creation failed - no user ID returned",
        };
      }

      console.log("Auth user created:", authData.user.id);

      // Parse complex fields
      const duesPaid = memberData.dues_paid?.toLowerCase() === "true";
      const joinDate =
        memberData.join_date || new Date().toISOString().split("T")[0];
      const accountBalance = memberData.account_balance
        ? parseFloat(memberData.account_balance)
        : 0.0;
      const roleTags = memberData.role_tags
        ? memberData.role_tags.split(",").map((tag) => tag.trim())
        : [];

      // Wait a bit for the auth user to be fully created
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Create/update profile with additional data
      const profileData = {
        id: authData.user.id,
        first_name: memberData.first_name,
        last_name: memberData.last_name,
        phone: memberData.phone || null,
        voice_part: memberData.voice_part || null,
        status: memberData.status || "active",
        class_year: memberData.class_year || null,
        notes: memberData.notes || null,
        dues_paid: duesPaid,
        join_date: joinDate,
        role: memberData.role || "member",
        is_super_admin: memberData.role === "admin",
        title: memberData.title || "General Member",
        account_balance: accountBalance,
        avatar_url: memberData.avatar_url || null,
        special_roles: memberData.special_roles || null,
        role_tags: roleTags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, {
          onConflict: "id",
          ignoreDuplicates: false,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Try to clean up the auth user if profile creation fails
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error("Failed to cleanup auth user:", cleanupError);
        }
        return {
          success: false,
          error: `Failed to create profile: ${profileError.message}`,
        };
      }

      console.log("User created successfully:", memberData.email);
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected error creating user:", error);

      if (
        error.message?.includes("rate limit") ||
        error.message?.includes("429")
      ) {
        if (retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount);
          console.log(
            `Rate limit error, retrying in ${delay}ms for ${memberData.email}...`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          return await createUserWithRetry(memberData, retryCount + 1);
        } else {
          return {
            success: false,
            rateLimited: true,
            error: "Rate limit exceeded after retries",
          };
        }
      }

      return {
        success: false,
        error: error.message || "Unknown error occurred",
      };
    }
  };

  const uploadMembers = async () => {
    if (!csvData.length) {
      toast.error("No members to upload");
      return;
    }

    setIsUploading(true);

    const results = {
      success: 0,
      failed: 0,
      rateLimited: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    try {
      console.log("🔄 Starting bulk upload of members...");

      // Process members in smaller batches with longer delays to avoid rate limits
      const batchSize = 3; // Reduced batch size
      const batchDelay = 5000; // Increased delay between batches

      for (let i = 0; i < csvData.length; i += batchSize) {
        const batch = csvData.slice(i, i + batchSize);
        console.log(
          `Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(csvData.length / batchSize)}`,
        );

        // Process batch members sequentially to avoid overwhelming the rate limiter
        for (const member of batch) {
          const result = await createUserWithRetry(member);

          if (result.success) {
            results.success++;
          } else if (result.rateLimited) {
            results.rateLimited++;
            results.errors.push({
              email: member.email,
              error: "Rate limited after retries",
            });
          } else {
            results.failed++;
            results.errors.push({
              email: member.email,
              error: result.error || "Unknown error",
            });
          }

          // Delay between individual users
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Longer delay between batches
        if (i + batchSize < csvData.length) {
          console.log(
            `Batch complete. Waiting ${batchDelay}ms before next batch...`,
          );
          await new Promise((resolve) => setTimeout(resolve, batchDelay));
        }
      }

      setUploadResults(results);

      if (results.success > 0) {
        toast.success(`Successfully created ${results.success} members!`);
      }

      if (results.failed > 0 || results.rateLimited > 0) {
        toast.error(
          `${results.failed + results.rateLimited} members failed to create`,
        );
      }

      if (results.rateLimited > 0) {
        toast.warning(
          `${results.rateLimited} members were rate limited. Try again later or contact support.`,
        );
      }

      // Reset form
      setFile(null);
      setCsvData([]);
      setIsPreviewMode(false);

      if (onMembersUploaded) {
        onMembersUploaded();
      }
    } catch (error: any) {
      console.error("💥 Error uploading members:", error);
      toast.error(
        `Failed to upload members: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `email,first_name,last_name,phone,voice_part,role,status,class_year,notes,dues_paid,join_date,title,account_balance,avatar_url,special_roles,role_tags
example@spelman.edu,Jane,Doe,555-0123,soprano_1,member,active,2025,Sample notes,true,2024-01-15,General Member,0.00,,Section Leader,"member,student"
student@spelman.edu,Mary,Smith,555-0124,alto_1,member,active,2026,Another member,false,2024-02-01,General Member,25.50,,,"member"
admin@spelman.edu,Sarah,Johnson,555-0125,soprano_2,admin,active,2024,Administrator account,true,2023-08-01,Administrator,0.00,,Director,"admin,faculty"`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "member_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded");
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
                  CSV should contain: email (required), first_name, last_name,
                  and any additional profile fields
                </p>
              </div>
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="ml-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>

            {file && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {file.name}
                </span>
                <Badge variant="outline">
                  {(file.size / 1024).toFixed(1)} KB
                </Badge>
              </div>
            )}

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Rate Limit Protection:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    Upload processes in small batches to avoid email rate limits
                  </li>
                  <li>
                    Automatic retries with exponential backoff for failed
                    uploads
                  </li>
                  <li>
                    If rate limited, try again later or upload smaller batches
                  </li>
                  <li>Large uploads may take several minutes to complete</li>
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
                <span className="text-sm">
                  <strong>{csvData.length}</strong> members found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm">
                  Est. time: {Math.ceil(csvData.length / 3) * 5} seconds
                </span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Preview (first 3 members):</h4>
              <div className="space-y-2">
                {csvData.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="text-sm bg-white border rounded p-2"
                  >
                    <div className="font-medium">{member.email}</div>
                    <div className="text-muted-foreground">
                      {member.first_name} {member.last_name}
                      {member.voice_part && ` • ${member.voice_part}`}
                      {member.class_year && ` • Class ${member.class_year}`}
                      {member.role && ` • ${member.role}`}
                      {member.title && ` • ${member.title}`}
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

            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Upload Process:</strong> Members will be created in
                batches of 3 with delays to prevent rate limiting. This may take
                a few minutes for large uploads.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button onClick={() => setIsPreviewMode(false)} variant="outline">
                Back to Upload
              </Button>
              <Button
                onClick={uploadMembers}
                disabled={isUploading}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading
                  ? "Uploading..."
                  : `Import ${csvData.length} Members`}
              </Button>
            </div>
          </div>
        )}

        {uploadResults && (
          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Upload Results</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Successfully created: {uploadResults.success} members
                </span>
              </div>
              {uploadResults.failed > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Failed: {uploadResults.failed} members</span>
                </div>
              )}
              {uploadResults.rateLimited > 0 && (
                <div className="flex items-center gap-2 text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>
                    Rate limited: {uploadResults.rateLimited} members (try again
                    later)
                  </span>
                </div>
              )}
              {uploadResults.errors.length > 0 && (
                <div className="max-h-32 overflow-y-auto mt-3">
                  <h5 className="text-sm font-medium mb-2">Errors:</h5>
                  {uploadResults.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-600">
                      {error.email}: {error.error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
