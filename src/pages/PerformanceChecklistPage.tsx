
import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Music, Calendar, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function PerformanceChecklistPage() {
  const upcomingPerformance = {
    name: "Spring Concert 2025",
    date: "April 15, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "Spelman College Auditorium",
    callTime: "5:30 PM",
    dressingRoom: "Room 102 & 103"
  };

  const wardrobeItems = [
    { item: "Black Concert Dress", required: true, notes: "Full length, sleeves below elbow" },
    { item: "Pearl Necklace", required: true, notes: "Single strand, 16-18 inches" },
    { item: "Black Closed-Toe Shoes", required: true, notes: "No heels above 2 inches" },
    { item: "Pearl Earrings", required: true, notes: "Studs only" },
    { item: "Hair Accessory", required: false, notes: "Optional, must be black or pearl color" }
  ];

  const performanceNotes = [
    "Bring water bottle (clear, no labels)",
    "Have all sheet music in black binders",
    "Arrive in full concert attire",
    "Cell phones must be turned off during performance",
    "Remember to bring your assigned folder number"
  ];

  return (
    <div className="container mx-auto px-4">
      <PageHeader
        title="Performance Checklist"
        description="Details for upcoming performances and wardrobe requirements"
        icon={<Music className="h-6 w-6" />}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Performance</CardTitle>
          <CardDescription>Your next scheduled performance details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{upcomingPerformance.name}</h3>
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{upcomingPerformance.date}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{upcomingPerformance.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{upcomingPerformance.location}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Call Time:</p>
                <p className="text-base">{upcomingPerformance.callTime}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Dressing Room:</p>
                <p className="text-base">{upcomingPerformance.dressingRoom}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wardrobe Requirements</CardTitle>
          <CardDescription>Required attire for performances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wardrobeItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>
                    <Badge variant={item.required ? "default" : "outline"}>
                      {item.required ? "Required" : "Optional"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Performance Notes</CardTitle>
          <CardDescription>Important reminders for day of performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {performanceNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
