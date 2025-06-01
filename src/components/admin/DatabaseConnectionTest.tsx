
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Database, Play, RefreshCw } from 'lucide-react';
import { runDatabaseConnectionTests, formatTestResults, DatabaseTestResult } from '@/utils/admin/databaseConnectionTest';
import { toast } from 'sonner';

export function DatabaseConnectionTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<DatabaseTestResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      console.log('🔧 Starting database connection tests...');
      const results = await runDatabaseConnectionTests();
      console.log('🔧 Test results:', results);
      
      setTestResults(results);
      
      const report = formatTestResults(results);
      console.log('📋 Test Report:\n', report);
      
      const errorCount = results.filter(r => r.status === 'error').length;
      const warningCount = results.filter(r => r.status === 'warning').length;
      
      if (errorCount > 0) {
        toast.error(`Database tests completed with ${errorCount} errors and ${warningCount} warnings`);
      } else if (warningCount > 0) {
        toast.warning(`Database tests completed with ${warningCount} warnings`);
      } else {
        toast.success('All database tests passed successfully!');
      }
      
    } catch (error) {
      console.error('💥 Database test error:', error);
      toast.error('Failed to run database tests');
      setTestResults([{
        test: 'Test Suite',
        status: 'error',
        message: `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      }]);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default' as const,
      warning: 'secondary' as const,
      error: 'destructive' as const
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Test
        </CardTitle>
        <CardDescription>
          Run comprehensive tests to verify database connectivity and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? 'Running Tests...' : 'Run Database Tests'}
          </Button>
          
          {testResults.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </Button>
          )}
        </div>

        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>

            {showDetails && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-xs mt-2 max-h-96 overflow-auto">
                    {formatTestResults(testResults)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-2 border-t">
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {testResults.filter(r => r.status === 'success').length} Passed
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  {testResults.filter(r => r.status === 'warning').length} Warnings
                </span>
                <span className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  {testResults.filter(r => r.status === 'error').length} Errors
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
