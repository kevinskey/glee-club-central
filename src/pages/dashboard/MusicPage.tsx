
import React, { useState, useEffect } from 'react';
import { PageHeader } from "@/components/ui/page-header";
import { Music, Search, Plus, FileText, ListMusic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SheetMusic {
  id: string;
  title: string;
  composer: string;
  voicing: string;
  file_url: string;
}

const MusicPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Sample sheet music data
  const sampleSheetMusic: SheetMusic[] = [
    {
      id: '1',
      title: "The Lord Bless You and Keep You",
      composer: "Peter C. Lutkin",
      voicing: "SATB",
      file_url: "https://www.cpdl.org/wiki/images/2/20/Lutkin_-_The_Lord_Bless_You_and_Keep_You.pdf"
    },
    {
      id: '2',
      title: "Ave Verum Corpus",
      composer: "W.A. Mozart",
      voicing: "SATB",
      file_url: "https://www.cpdl.org/wiki/images/a/a2/MozartAveVerum.pdf"
    },
    {
      id: '3',
      title: "Swing Low, Sweet Chariot",
      composer: "Traditional Spiritual",
      voicing: "SAB",
      file_url: "https://www.cpdl.org/wiki/images/c/c6/Swan-swi.pdf"
    }
  ];
  
  const [filteredMusic, setFilteredMusic] = useState(sampleSheetMusic);
  
  // Filter music based on search query
  useEffect(() => {
    if (searchQuery) {
      setFilteredMusic(
        sampleSheetMusic.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.composer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.voicing.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredMusic(sampleSheetMusic);
    }
  }, [searchQuery]);
  
  // View sheet music
  const viewSheetMusic = (item: SheetMusic) => {
    navigate(`/dashboard/sheet-music/${item.id}`, { state: { file: item } });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Sheet Music"
        description="Access your sheet music for upcoming performances"
        icon={<Music className="h-6 w-6" />}
        actions={
          <Button 
            variant="default" 
            className="bg-glee-purple hover:bg-glee-purple/90"
            onClick={() => navigate('/dashboard/sheet-music')}
          >
            <ListMusic className="h-4 w-4 mr-2" /> All Music
          </Button>
        }
      />
      
      <div className="mt-8 space-y-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sheet music..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Recently Assigned Music */}
        <Tabs defaultValue="assigned" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="assigned">Assigned Music</TabsTrigger>
            <TabsTrigger value="downloads">Downloaded</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assigned">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMusic.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => viewSheetMusic(item)}
                >
                  <div className="aspect-[3/4] bg-muted flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.composer}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {item.voicing}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new sheet music card */}
              <button
                onClick={() => navigate('/dashboard/sheet-music')}
                className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 hover:border-primary/50 hover:bg-muted/50 transition-colors h-full"
              >
                <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">View All Music</p>
              </button>
            </div>
          </TabsContent>
          
          <TabsContent value="downloads">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No downloaded sheet music</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Your downloaded sheet music will appear here
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No favorites yet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Mark sheet music as favorite to find it quickly
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MusicPage;
