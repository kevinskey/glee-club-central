import React from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Headphones, Music, PlayCircle, Music2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SightReadingEmbed } from "@/components/practice/SightReadingEmbed";

interface PracticeMedia {
  id: string;
  title: string;
  type: "audio" | "video";
  description: string;
  date: string;
  duration: string;
  url: string;
}

// Sample data
const practiceData: Record<string, PracticeMedia[]> = {
  "warmups": [
    {
      id: "w1",
      title: "Vocal Warm-up Series 1",
      type: "audio",
      description: "Complete vocal warm-up sequence",
      date: "2023-10-10",
      duration: "10:25",
      url: "#"
    },
    {
      id: "w2",
      title: "Breathing Exercises",
      type: "video",
      description: "Proper breathing techniques for singing",
      date: "2023-09-15",
      duration: "5:10",
      url: "#"
    }
  ],
  "sectionals": [
    {
      id: "s1",
      title: "Soprano Sectional - Ave Maria",
      type: "audio",
      description: "Practice recording for the soprano section",
      date: "2023-10-12",
      duration: "8:45",
      url: "#"
    },
    {
      id: "s2",
      title: "Alto Sectional - Ave Maria",
      type: "audio",
      description: "Practice recording for the alto section",
      date: "2023-10-12",
      duration: "9:30",
      url: "#"
    }
  ],
  "full": [
    {
      id: "f1",
      title: "Full Choir Rehearsal - Hallelujah",
      type: "audio",
      description: "Complete rehearsal recording",
      date: "2023-09-22",
      duration: "15:20",
      url: "#"
    }
  ]
};

export default function PracticePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<string>("warmups");
  
  // Handle media playback
  const handlePlay = (media: PracticeMedia) => {
    // This would be replaced with actual playback functionality
    console.log(`Playing: ${media.title}`);
    alert(`In a real app, this would play "${media.title}"`);
  };

  return (
    <div>
      <PageHeader
        title="Practice on Your Own"
        description="Access warm-ups, sectional recordings, sight reading practice, and other materials"
        icon={<Headphones className="h-6 w-6" />}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="warmups">Warm-ups</TabsTrigger>
          <TabsTrigger value="sectionals">Sectionals</TabsTrigger>
          <TabsTrigger value="full">Full Choir</TabsTrigger>
          <TabsTrigger value="sightreading">Sight Reading</TabsTrigger>
        </TabsList>

        {Object.entries(practiceData).map(([key, mediaItems]) => (
          <TabsContent key={key} value={key}>
            <div>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="h-5 w-5" /> 
                      {key === "warmups" ? "Warm-ups" : key === "sectionals" ? "Sectional Recordings" : "Full Choir Recordings"}
                    </CardTitle>
                    <CardDescription>
                      {key === "warmups"
                        ? "Exercises to prepare your voice"
                        : key === "sectionals"
                        ? "Practice recordings for specific voice parts"
                        : "Complete choir recordings for reference"}
                    </CardDescription>
                  </div>
                  {user?.role === "admin" && (
                    <Button size="sm">Upload New Recording</Button>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mediaItems.map((media) => (
                      <div
                        key={media.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{media.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {media.description} • {media.duration}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Added {media.date}
                          </p>
                        </div>
                        <Button 
                          onClick={() => handlePlay(media)}
                          className="ml-4 flex items-center gap-2"
                        >
                          <PlayCircle className="h-5 w-5" />
                          {media.type === "audio" ? "Play Audio" : "Play Video"}
                        </Button>
                      </div>
                    ))}

                    {mediaItems.length === 0 && (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Headphones className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-medium">No recordings yet</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          There are no practice recordings uploaded in this category yet.
                        </p>
                        {user?.role === "admin" && (
                          <Button>Upload Recording</Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}

        {/* Sight Reading Practice Tab - Integration with SightReadingFactory.com */}
        <TabsContent value="sightreading">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Music2 className="h-5 w-5" /> 
                  Sight Reading Practice
                </CardTitle>
                <CardDescription>
                  Improve your sight reading skills with interactive exercises from SightReadingFactory.com
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <SightReadingEmbed />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
