import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Database,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
} from "lucide-react";
import {
  migrateMediaIds,
  getMediaMigrationReport,
  MediaMigrationResult,
} from "@/utils/mediaMigration";
import { toast } from "sonner";

export function MediaMigrationManager() {
  const [migrationResult, setMigrationResult] =
    useState<MediaMigrationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState({
    totalMedia: 0,
    indexedMedia: 0,
    brokenSlideReferences: 0,
    validSlideReferences: 0,
  });

  const fetchReport = async () => {
    try {
      const reportData = await getMediaMigrationReport();
      setReport(reportData);
    } catch (error) {
      console.error("Error fetching migration report:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const runMigration = async () => {
    if (
      !confirm(
        "This will regenerate all media IDs and update references. Are you sure you want to proceed?",
      )
    ) {
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setMigrationResult(null);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 500);

      const result = await migrateMediaIds();

      clearInterval(progressInterval);
      setProgress(100);
      setMigrationResult(result);

      if (result.success) {
        toast.success(
          `Migration completed! Migrated ${result.migratedCount} media files and updated ${result.updatedSlides} slides.`,
        );
        await fetchReport(); // Refresh the report
      } else {
        toast.error(
          "Migration completed with errors. Check the details below.",
        );
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Migration failed: " + (error.message || "Unknown error"));
    } finally {
      setIsRunning(false);
    }
  };

  const migrationNeeded =
    report.totalMedia > 0 &&
    (report.indexedMedia < report.totalMedia ||
      report.brokenSlideReferences > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Media ID Migration Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {report.totalMedia}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Media Files
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {report.indexedMedia}
              </div>
              <div className="text-sm text-muted-foreground">Indexed Media</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {report.brokenSlideReferences}
              </div>
              <div className="text-sm text-muted-foreground">
                Broken References
              </div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {report.validSlideReferences}
              </div>
              <div className="text-sm text-muted-foreground">
                Valid References
              </div>
            </div>
          </div>

          {/* Migration Status */}
          {migrationNeeded ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Media ID migration is recommended. You have{" "}
                {report.totalMedia - report.indexedMedia} unindexed media files
                and {report.brokenSlideReferences} broken slide references.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                All media files are properly indexed and all slide references
                are valid.
              </AlertDescription>
            </Alert>
          )}

          {/* Migration Progress */}
          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Migration in progress...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Migration Controls */}
          <div className="flex gap-2">
            <Button
              onClick={runMigration}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              {isRunning ? "Running Migration..." : "Run Media ID Migration"}
            </Button>

            <Button
              variant="outline"
              onClick={fetchReport}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Report
            </Button>
          </div>

          {/* Migration Results */}
          {migrationResult && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium flex items-center gap-2">
                {migrationResult.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                Migration Results
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Badge variant="secondary">
                    {migrationResult.migratedCount} Media Files Migrated
                  </Badge>
                </div>
                <div>
                  <Badge variant="secondary">
                    {migrationResult.updatedSlides} Slides Updated
                  </Badge>
                </div>
              </div>

              {migrationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-red-600">Errors:</h5>
                  <div className="space-y-1">
                    {migrationResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-sm text-red-600 bg-red-50 p-2 rounded"
                      >
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(migrationResult.idMapping).length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">ID Mapping:</h5>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {Object.entries(migrationResult.idMapping).map(
                      ([oldId, newId]) => (
                        <div
                          key={oldId}
                          className="text-sm font-mono bg-gray-50 p-2 rounded flex items-center gap-2"
                        >
                          <span className="text-red-600">
                            {oldId.substring(0, 8)}...
                          </span>
                          <ArrowRight className="h-3 w-3" />
                          <span className="text-green-600">{newId}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Information */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This migration will create new indexed IDs for all media files
              (format: media-001-timestamp) and update all hero slide references
              to use the new IDs. Broken references will be cleared.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
