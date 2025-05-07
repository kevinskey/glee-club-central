
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Folder, Mic, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface MusicAccessTabProps {
  memberId: string;
  voicePart: string | null | undefined;
}

export const MusicAccessTab: React.FC<MusicAccessTabProps> = ({ memberId, voicePart }) => {
  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "General";
    
    switch (voicePart) {
      case "soprano_1": return "Soprano 1";
      case "soprano_2": return "Soprano 2";
      case "alto_1": return "Alto 1";
      case "alto_2": return "Alto 2";
      case "tenor_1": return "Tenor 1";
      case "tenor_2": return "Tenor 2";
      case "bass_1": return "Bass 1";
      case "bass_2": return "Bass 2";
      default: return voicePart;
    }
  };
  
  // Mock data for sheet music
  const sheetMusicList = [
    { id: 1, title: "Amazing Grace", composer: "John Newton", type: "PDF", addedDate: "2025-04-01" },
    { id: 2, title: "Lift Every Voice and Sing", composer: "J. Rosamond Johnson", type: "PDF", addedDate: "2025-04-03" },
    { id: 3, title: "Wade in the Water", composer: "Traditional", type: "PDF", addedDate: "2025-04-05" },
    { id: 4, title: "Hallelujah", composer: "Leonard Cohen", type: "PDF", addedDate: "2025-04-07" },
    { id: 5, title: "Total Praise", composer: "Richard Smallwood", type: "PDF", addedDate: "2025-04-10" },
  ];

  // Mock data for voice check records
  const voiceCheckRecords = [
    { id: 1, date: "2025-04-15", notes: "Excellent pitch control. Range extends to high C." },
    { id: 2, date: "2025-03-01", notes: "Good breath support. Working on sustained notes." },
  ];

  // Mock data for solo roles
  const soloRoles = [
    { id: 1, event: "Spring Concert 2025", song: "Amazing Grace", role: "Verse 2 Solo" },
    { id: 2, event: "Community Outreach", song: "Wade in the Water", role: "Opening Solo" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" /> Folder Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">Folder #: <span className="font-bold">A-23</span></p>
              <p className="text-muted-foreground">Assigned section: {formatVoicePart(voicePart)}</p>
            </div>
            <Badge className="px-3 py-1 bg-green-500">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" /> Sheet Music Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Access sheet music for {formatVoicePart(voicePart)}
          </p>
          <Button className="w-full sm:w-auto">
            View {formatVoicePart(voicePart)} Music Folder
          </Button>
          <Separator className="my-4" />
          <h4 className="font-medium mb-2">Current Repertoire:</h4>
          <div className="space-y-3">
            {sheetMusicList.map((music) => (
              <div key={music.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{music.title}</p>
                  <p className="text-sm text-muted-foreground">Composer: {music.composer}</p>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> View PDF
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" /> Voice Check Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            {voiceCheckRecords.map((record) => (
              <div key={record.id} className="mb-4 border-b pb-3">
                <div className="flex justify-between">
                  <h4 className="font-medium">Voice Check</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="mt-1">{record.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" /> Solo Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            {soloRoles.length > 0 ? (
              soloRoles.map((role) => (
                <div key={role.id} className="mb-4 border-b pb-3">
                  <h4 className="font-medium">{role.event}</h4>
                  <p className="text-sm">Song: {role.song}</p>
                  <p className="text-sm font-medium mt-1">Role: {role.role}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No solo roles assigned yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
