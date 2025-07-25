
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { CheckCircle, XCircle, Clock, Calendar, CheckSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProfile } from "@/contexts/ProfileContext";

export default function AttendancePage() {
  const { profile } = useProfile();

  // TODO: Replace with actual attendance data from database
  const attendanceRecords: any[] = [];
  const upcomingEvents: any[] = [];

  // Calculate attendance statistics
  const totalEvents = attendanceRecords.length;
  const present = attendanceRecords.filter(r => r.status === "present").length;
  const late = attendanceRecords.filter(r => r.status === "late").length;
  const excused = attendanceRecords.filter(r => r.status === "excused").length;
  const absent = attendanceRecords.filter(r => r.status === "absent").length;
  const attendanceRate = totalEvents > 0 ? Math.round(((present + late + excused) / totalEvents) * 100) : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>;
      case "late":
        return <Badge className="bg-yellow-500">Late</Badge>;
      case "excused":
        return <Badge className="bg-blue-500">Excused</Badge>;
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Attendance Tracker"
        description="Your attendance record and upcoming events"
        icon={<CheckSquare className="h-6 w-6" />}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Summary of your attendance record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-muted rounded-md">
              <p className="font-bold text-2xl text-green-600">{present}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="font-bold text-2xl text-yellow-600">{late}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="font-bold text-2xl text-blue-600">{excused}</p>
              <p className="text-sm text-muted-foreground">Excused</p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="font-bold text-2xl text-red-600">{absent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div className="p-4 bg-muted rounded-md">
              <p className="font-bold text-2xl">{attendanceRate}%</p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Record of your past attendance</CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="mx-auto h-10 w-10 mb-2 opacity-30" />
                <p>No attendance records yet</p>
                <p className="text-sm">Your attendance will appear here once events are tracked</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.event}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you're expected to attend</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-10 w-10 mb-2 opacity-30" />
                <p>No upcoming events</p>
                <p className="text-sm">Check back later for scheduled events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-md p-4">
                    <h3 className="font-medium">{event.event}</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
