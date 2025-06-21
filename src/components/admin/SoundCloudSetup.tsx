import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Music,
  ExternalLink,
  Key,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SoundCloudSetup() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { toast } = useToast();

  const testConnection = async () => {
    if (!clientId.trim()) {
      toast({
        title: "Client ID Required",
        description: "Please enter your SoundCloud Client ID",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus("idle");

    try {
      const response = await fetch(
        "https://dzzptovqfqausipsgabw.supabase.co/functions/v1/soundcloud-oauth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enB0b3ZxZnFhdXNpcHNnYWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MDM1MjksImV4cCI6MjA2MTk3OTUyOX0.7jSsV-y-32C7f23rw6smPPzuQs6HsQeKpySP4ae_C5s",
          },
          body: JSON.stringify({ action: "test" }),
        },
      );

      const data = await response.json();

      if (data.needsSetup) {
        setConnectionStatus("error");
        toast({
          title: "Setup Required",
          description:
            "SoundCloud API credentials need to be configured in Supabase environment variables.",
          variant: "destructive",
        });
      } else {
        setConnectionStatus("success");
        toast({
          title: "Connection Successful",
          description: "SoundCloud API is properly configured and accessible.",
        });
      }
    } catch (error) {
      setConnectionStatus("error");
      toast({
        title: "Connection Failed",
        description: "Unable to test SoundCloud API connection.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            SoundCloud API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              To enable SoundCloud integration, you need to configure API
              credentials in your Supabase environment variables. These
              credentials are stored securely in Supabase and not in your
              codebase.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <Label htmlFor="clientId">SoundCloud Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your SoundCloud Client ID for testing"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is for testing only. The actual Client ID should be set in
                Supabase environment variables.
              </p>
            </div>

            <div>
              <Label htmlFor="clientSecret">SoundCloud Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Enter your SoundCloud Client Secret for testing"
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is for testing only. The actual Client Secret should be set
                in Supabase environment variables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={testConnection}
              disabled={isTestingConnection}
              variant="outline"
            >
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Button>

            {connectionStatus === "success" && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected</span>
              </div>
            )}

            {connectionStatus === "error" && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Setup Required</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium">1. Create a SoundCloud App</h4>
            <p className="text-sm text-muted-foreground">
              Go to{" "}
              <a
                href="https://developers.soundcloud.com/docs/api/guide#authentication"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline inline-flex items-center gap-1"
              >
                SoundCloud Developers <ExternalLink className="w-3 h-3" />
              </a>{" "}
              and create a new application.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">2. Get Your Credentials</h4>
            <p className="text-sm text-muted-foreground">
              Copy your Client ID and Client Secret from your SoundCloud app
              settings.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">
              3. Configure Supabase Environment Variables
            </h4>
            <p className="text-sm text-muted-foreground">
              In your Supabase project settings, add these environment
              variables:
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-sm">
              <div>SOUNDCLOUD_CLIENT_ID=your_client_id_here</div>
              <div>SOUNDCLOUD_CLIENT_SECRET=your_client_secret_here</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">4. Deploy the Function</h4>
            <p className="text-sm text-muted-foreground">
              The SoundCloud OAuth function should be deployed to your Supabase
              project. Make sure the function has access to the environment
              variables.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
