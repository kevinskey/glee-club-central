
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Attendance</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rehearsal Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track and manage rehearsal attendance for all members.</p>
            <div className="flex items-center space-x-2 mb-4">
              <Input type="date" className="max-w-xs" />
              <Button variant="outline">View</Button>
            </div>
            <div className="rounded-md border">
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Select a date to view attendance records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Track and manage performance attendance for all members.</p>
            <div className="flex items-center space-x-2 mb-4">
              <Input type="date" className="max-w-xs" />
              <Button variant="outline">View</Button>
            </div>
            <div className="rounded-md border">
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Select a date to view performance attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
