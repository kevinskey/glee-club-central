
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Support & Help</CardTitle>
          <CardDescription>
            Having trouble accessing your account? We're here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              If you're experiencing issues with your profile or account access, 
              please contact our support team for assistance.
            </p>
            
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Common Issues:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Profile not loading after login</li>
                <li>• Missing role or permissions</li>
                <li>• Account setup incomplete</li>
                <li>• Dashboard access problems</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="mailto:support@spelmangleeclub.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </a>
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
