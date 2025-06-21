import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Users, AlertCircle, CheckCircle } from "lucide-react";

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
}

export function ReaderUserImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    try {
      setIsImporting(true);
      setImportResult(null);

      const { data, error } = await supabase.functions.invoke(
        "import-reader-users",
      );

      if (error) {
        console.error("Import error:", error);
        toast.error("Failed to import users");
        return;
      }

      if (data.success) {
        setImportResult(data.results);
        toast.success(data.message);
      } else {
        toast.error("Import failed: " + data.error);
      }
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import users");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Import Reader Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will import all users from the music reader application into
            the main Glee World database. Existing users will be skipped. New
            users will be created with "member" role and will need to reset
            their passwords.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleImport}
          disabled={isImporting}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isImporting ? "Importing Users..." : "Import All Reader Users"}
        </Button>

        {importResult && (
          <div className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Import completed successfully!
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {importResult.total}
                </div>
                <div className="text-sm text-blue-700">Total Users</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {importResult.imported}
                </div>
                <div className="text-sm text-green-700">Imported</div>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">
                  {importResult.skipped}
                </div>
                <div className="text-sm text-yellow-700">Skipped</div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Import Errors:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
