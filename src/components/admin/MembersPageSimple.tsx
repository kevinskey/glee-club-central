
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function MembersPageSimple() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Members Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading members...</p>
        </CardContent>
      </Card>
    </div>
  );
}
