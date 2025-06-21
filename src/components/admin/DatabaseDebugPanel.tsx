import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUsersDebug } from "@/hooks/user/useUsersDebug";
import { AlertCircle, Database, User, Shield } from "lucide-react";

export const DatabaseDebugPanel: React.FC = () => {
  const {
    testConnection,
    testAuth,
    testBasicQuery,
    testAdminQuery,
    isLoading,
    results,
  } = useUsersDebug();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Database Connection Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={testConnection}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Database className="mr-2 h-4 w-4" />
            Test Connection
          </Button>

          <Button
            onClick={testAuth}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <User className="mr-2 h-4 w-4" />
            Test Auth
          </Button>

          <Button
            onClick={testBasicQuery}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            Test Own Profile
          </Button>

          <Button
            onClick={testAdminQuery}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <Shield className="mr-2 h-4 w-4" />
            Test Admin Query
          </Button>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Debug Results:</h4>
            <div className="space-y-1 font-mono text-sm">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={
                    result.includes("❌")
                      ? "text-red-600"
                      : result.includes("✅")
                        ? "text-green-600"
                        : result.includes("⚠️")
                          ? "text-orange-600"
                          : "text-gray-700"
                  }
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
