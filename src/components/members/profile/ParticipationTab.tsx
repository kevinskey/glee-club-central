import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceRecords } from "@/utils/supabaseQueries";
import { Check, X, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ParticipationTabProps {
  memberId: string;
}

export const ParticipationTab: React.FC<ParticipationTabProps> = ({ memberId }) => {
  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['attendanceRecords', memberId],
    queryFn: () => fetchAttendanceRecords(memberId),
    enabled: !!memberId,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500 flex items-center gap-1"><Check className="h-3 w-3" /> Present</Badge>;
      case "absent":
        return <Badge className="bg-red-500 flex items-center gap-1"><X className="h-3 w-3" /> Absent</Badge>;
      case "late":
        return <Badge className="bg-yellow-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Late</Badge>;
      case "excused":
        return <Badge className="bg-blue-500 flex items-center gap-1">Excused</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Mock data for repertoire check-off
  const repertoire = [
    { id: 1, title: "Amazing Grace", composer: "John Newton", checked: true },
    { id: 2, title: "Lift Every Voice and Sing", composer: "J. Rosamond Johnson", checked: true },
    { id: 3, title: "Wade in the Water", composer: "Traditional", checked: false },
    { id: 4, title: "Hallelujah", composer: "Leonard Cohen", checked: true },
    { id: 5, title: "Total Praise", composer: "Richard Smallwood", checked: false },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          ) : attendanceRecords && attendanceRecords.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.calendar_events?.title || "Unknown Event"}</TableCell>
                    <TableCell>
                      {record.calendar_events?.date
                        ? new Date(record.calendar_events.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{record.notes || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-4 text-muted-foreground">No attendance records found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repertoire Check-Off</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Composer</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repertoire.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.composer}</TableCell>
                  <TableCell>
                    {song.checked ? (
                      <Badge className="bg-green-500 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Checked Off
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <X className="h-3 w-3" /> Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rehearsal Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>April 15, 2025 - Regular Rehearsal</AccordionTrigger>
              <AccordionContent>
                Worked on breath support for the high notes in "Amazing Grace". Needs additional practice on measures 24-30.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>April 8, 2025 - Sectional Practice</AccordionTrigger>
              <AccordionContent>
                Great improvement on pitch accuracy. Still working on timing in the second movement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>April 1, 2025 - Full Rehearsal</AccordionTrigger>
              <AccordionContent>
                Excellent performance in the ensemble. Taking leadership in the alto section.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};
