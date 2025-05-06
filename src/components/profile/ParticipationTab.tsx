
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceRecords } from "@/utils/supabaseQueries";
import { formatDate } from "@/lib/utils";

interface ParticipationTabProps {
  memberId: string;
}

export function ParticipationTab({ memberId }: ParticipationTabProps) {
  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['attendance', memberId],
    queryFn: () => fetchAttendanceRecords(memberId),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Present</Badge>;
      case "absent":
        return <Badge className="bg-red-500">Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-500">Late</Badge>;
      case "excused":
        return <Badge className="bg-blue-500">Excused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
          <CardDescription>
            Recent rehearsals and performances attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading attendance records...</div>
          ) : !attendanceRecords || attendanceRecords.length === 0 ? (
            <div className="text-center py-4">No attendance records found</div>
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
                    <TableCell>
                      {record.calendar_events?.date ? formatDate(record.calendar_events.date) : "N/A"}
                    </TableCell>
                    <TableCell>{record.calendar_events?.title || "Unknown Event"}</TableCell>
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
          <CardTitle>Repertoire Check-Off</CardTitle>
          <CardDescription>Current repertoire mastery tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <p className="italic text-muted-foreground text-center">
              Repertoire check-off feature coming soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
