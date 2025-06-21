import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  Eye,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CSVContact {
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

export function ElasticEmailCSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVContact[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [listName, setListName] = useState("");

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
      const contacts: CSVContact[] = [];

      // Look for common Elastic Email column names
      const emailCol = headers.findIndex(
        (h) => h.toLowerCase().includes("email") || h.toLowerCase() === "email",
      );
      const firstNameCol = headers.findIndex(
        (h) =>
          h.toLowerCase().includes("firstname") ||
          h.toLowerCase().includes("first_name") ||
          h.toLowerCase().includes("first name"),
      );
      const lastNameCol = headers.findIndex(
        (h) =>
          h.toLowerCase().includes("lastname") ||
          h.toLowerCase().includes("last_name") ||
          h.toLowerCase().includes("last name"),
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
          const contact: CSVContact = {
            email: values[emailCol],
            firstName: firstNameCol !== -1 ? values[firstNameCol] || "" : "",
            lastName: lastNameCol !== -1 ? values[lastNameCol] || "" : "",
          };

          // Add any additional columns as custom fields
          headers.forEach((header, index) => {
            if (
              index !== emailCol &&
              index !== firstNameCol &&
              index !== lastNameCol
            ) {
              contact[header] = values[index] || "";
            }
          });

          contacts.push(contact);
        }
      }

      setCsvData(contacts);
      setListName(`Imported-${new Date().toISOString().split("T")[0]}`);
      setIsPreviewMode(true);
      toast.success(`Parsed ${contacts.length} contacts from CSV`);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast.error("Failed to parse CSV file");
    }
  };

  const uploadToElasticEmail = async () => {
    if (!csvData.length || !listName.trim()) {
      toast.error("Please ensure you have contacts and a list name");
      return;
    }

    setIsUploading(true);

    try {
      console.log("🔄 Uploading CSV contacts to Elastic Email...");

      const { data, error } = await supabase.functions.invoke(
        "elastic-email-sync",
        {
          body: {
            action: "export_members",
            data: {
              members: csvData.map((contact) => ({
                email: contact.email,
                firstName: contact.firstName,
                lastName: contact.lastName,
                listName: listName,
              })),
            },
          },
        },
      );

      if (error) {
        console.error("❌ Upload error:", error);
        throw error;
      }

      console.log("✅ Upload successful:", data);
      toast.success(
        `Successfully uploaded ${csvData.length} contacts to Elastic Email!`,
      );

      // Reset form
      setFile(null);
      setCsvData([]);
      setIsPreviewMode(false);
      setListName("");
    } catch (error: any) {
      console.error("💥 Error uploading to Elastic Email:", error);
      toast.error(
        `Failed to upload contacts: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import CSV to Elastic Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPreviewMode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground">
                CSV should contain columns: email (required), firstName,
                lastName
              </p>
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

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Expected CSV Format:</h4>
              <div className="text-sm font-mono bg-white border rounded p-2">
                email,firstName,lastName
                <br />
                john@example.com,John,Doe
                <br />
                jane@example.com,Jane,Smith
              </div>
            </div>
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
                  <strong>{csvData.length}</strong> contacts found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm">Ready to upload</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="list-name">Contact List Name</Label>
              <Input
                id="list-name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="Enter list name for Elastic Email"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Preview (first 3 contacts):</h4>
              <div className="space-y-2">
                {csvData.slice(0, 3).map((contact, index) => (
                  <div
                    key={index}
                    className="text-sm bg-white border rounded p-2"
                  >
                    <strong>{contact.email}</strong>
                    {contact.firstName || contact.lastName ? (
                      <span className="ml-2 text-muted-foreground">
                        ({contact.firstName} {contact.lastName})
                      </span>
                    ) : null}
                  </div>
                ))}
                {csvData.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    ...and {csvData.length - 3} more contacts
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setIsPreviewMode(false)} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Back to Upload
              </Button>
              <Button
                onClick={uploadToElasticEmail}
                disabled={isUploading || !listName.trim()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading
                  ? "Uploading..."
                  : `Upload ${csvData.length} Contacts`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
