
import React from 'react';
import { PublicPageWrapper } from '@/components/landing/PublicPageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PublicPageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Spelman Glee Club
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the rich history and tradition of the Spelman College Glee Club
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Spelman College Glee Club is dedicated to excellence in choral music performance 
                  and the development of young women as artists and leaders.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Our History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Founded in the tradition of excellence that defines Spelman College, 
                  our Glee Club has been inspiring audiences for decades.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicPageWrapper>
  );
}
