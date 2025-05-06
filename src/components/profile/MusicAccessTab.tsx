
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Music, Mic } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MusicAccessTabProps {
  memberId: string;
  voicePart: string | null | undefined;
}

export function MusicAccessTab({ memberId, voicePart }: MusicAccessTabProps) {
  const formatVoicePart = (voicePart: string | null | undefined) => {
    if (!voicePart) return "Not assigned";
    
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

  const sampleSheetMusic = [
    { title: "Amazing Grace", composer: "Traditional", id: "1" },
    { title: "Lift Every Voice and Sing", composer: "J. Rosamond Johnson", id: "2" },
    { title: "Wade in the Water", composer: "Traditional Spiritual", id: "3" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Folder Assignment</CardTitle>
          <CardDescription>
            Your assigned music folder and section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Voice Part</h3>
              <p>{formatVoicePart(voicePart)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Folder Number</h3>
              <p>#{memberId.substring(0, 4)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sheet Music</CardTitle>
          <CardDescription>
            Access your section's sheet music files
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sampleSheetMusic.length === 0 ? (
            <div className="text-center py-4">No sheet music available for your section</div>
          ) : (
            <div className="space-y-4">
              {sampleSheetMusic.map((sheet) => (
                <div key={sheet.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{sheet.title}</p>
                      <p className="text-sm text-muted-foreground">{sheet.composer}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
              
              <div className="mt-4 pt-2">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View All Sheet Music
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Voice Check & Solo Roles</CardTitle>
          <CardDescription>
            Voice check records and solo assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Voice Check Record</h3>
              <div className="border rounded-md p-3">
                <div className="flex items-center mb-2">
                  <Mic className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="font-medium">Last Voice Check: March 15, 2025</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notes: Good pitch accuracy and breath control. Work on diction in higher registers.
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Solo Roles</h3>
              <div className="border rounded-md p-3">
                <div className="flex items-start mb-3">
                  <Music className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Spring Concert 2025</p>
                    <p className="text-sm text-muted-foreground">
                      Solo in "Lift Every Voice and Sing" - Measures 32-40
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Music className="h-4 w-4 mt-1 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Winter Showcase 2024</p>
                    <p className="text-sm text-muted-foreground">
                      Featured vocalist in "Amazing Grace" - Opening verse
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
