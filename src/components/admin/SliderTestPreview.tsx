
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomSlideRenderer } from '@/components/landing/CustomSlideRenderer';
import { RefreshCw, CheckCircle, AlertCircle, Eye, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SliderTestPreviewProps {
  onExitPreview?: () => void;
}

interface TestResult {
  component: string;
  status: 'pass' | 'fail' | 'loading';
  message: string;
  data?: any;
}

export function SliderTestPreview({ onExitPreview }: SliderTestPreviewProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    runSliderTests();
  }, []);

  const runSliderTests = async () => {
    setIsRunningTests(true);
    const results: TestResult[] = [];

    // Test 1: Check slide_designs table
    try {
      results.push({ component: 'Slide Designs', status: 'loading', message: 'Testing...' });
      
      const { data: slideDesigns, error: slideError } = await supabase
        .from('slide_designs')
        .select('*')
        .eq('is_active', true);

      if (slideError) throw slideError;

      results[results.length - 1] = {
        component: 'Slide Designs',
        status: 'pass',
        message: `Found ${slideDesigns?.length || 0} active slide designs`,
        data: slideDesigns
      };
    } catch (error) {
      results[results.length - 1] = {
        component: 'Slide Designs',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Test 2: Check top_slider_items table
    try {
      results.push({ component: 'Top Slider Items', status: 'loading', message: 'Testing...' });
      
      const { data: topSliderItems, error: topSliderError } = await supabase
        .from('top_slider_items')
        .select('*')
        .eq('visible', true)
        .order('display_order');

      if (topSliderError) throw topSliderError;

      results[results.length - 1] = {
        component: 'Top Slider Items',
        status: 'pass',
        message: `Found ${topSliderItems?.length || 0} visible top slider items`,
        data: topSliderItems
      };
    } catch (error) {
      results[results.length - 1] = {
        component: 'Top Slider Items',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    // Test 3: Check site_images (hero) table
    try {
      results.push({ component: 'Hero Images', status: 'loading', message: 'Testing...' });
      
      const { data: heroImages, error: heroError } = await supabase
        .from('site_images')
        .select('*')
        .eq('category', 'hero')
        .order('position');

      if (heroError) throw heroError;

      results[results.length - 1] = {
        component: 'Hero Images',
        status: 'pass',
        message: `Found ${heroImages?.length || 0} hero images`,
        data: heroImages
      };
    } catch (error) {
      results[results.length - 1] = {
        component: 'Hero Images',
        status: 'fail',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }

    setTestResults([...results]);
    setIsRunningTests(false);
    
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    
    if (failCount === 0) {
      toast.success(`All slider tests passed! (${passCount}/${results.length})`);
    } else {
      toast.error(`${failCount} slider tests failed out of ${results.length}`);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'loading':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'loading':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Slider Test & Preview Console
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={runSliderTests}
                disabled={isRunningTests}
              >
                {isRunningTests ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
              {onExitPreview && (
                <Button variant="outline" size="sm" onClick={onExitPreview}>
                  <Settings className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tests" className="w-full">
            <TabsList>
              <TabsTrigger value="tests">System Tests</TabsTrigger>
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tests" className="mt-4">
              <div className="space-y-4">
                <div className="grid gap-4">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          <span className="font-medium">{result.component}</span>
                        </div>
                        <Badge variant={result.status === 'pass' ? 'default' : result.status === 'fail' ? 'destructive' : 'secondary'}>
                          {result.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer">View Data</summary>
                          <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto max-h-32">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>

                {testResults.length === 0 && !isRunningTests && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Click "Run Tests" to check slider functionality and data integrity.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Live Slider Preview</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode === 'desktop' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('desktop')}
                    >
                      Desktop
                    </Button>
                    <Button
                      variant={previewMode === 'mobile' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPreviewMode('mobile')}
                    >
                      Mobile
                    </Button>
                  </div>
                </div>
                
                <div className={`border rounded-lg overflow-hidden ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  <div className="bg-muted p-2 text-center text-sm text-muted-foreground">
                    Preview Mode: {previewMode} | Live Data
                  </div>
                  <div className={previewMode === 'mobile' ? 'scale-75 origin-top' : ''}>
                    <CustomSlideRenderer
                      autoPlay={true}
                      interval={3000}
                      height={previewMode === 'mobile' ? '200px' : '400px'}
                    />
                  </div>
                </div>
                
                <Alert>
                  <AlertDescription>
                    This preview shows live data from your slider configurations. Changes made in the admin panels will be reflected here after saving.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
