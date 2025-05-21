import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileMusic, Search, Filter } from "lucide-react";
import { MusicAppHeader } from "@/components/layout/MusicAppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function SheetMusicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // This would be integrated with actual sheet music data in a real implementation
  const placeholderSheetMusic = [
    { id: "1", title: "Ave Maria", composer: "Franz Schubert", voicePart: "Soprano" },
    { id: "2", title: "Hallelujah", composer: "Leonard Cohen", voicePart: "All Parts" },
    { id: "3", title: "The Storm Is Passing Over", composer: "Charles A. Tindley", voicePart: "Alto" },
    { id: "4", title: "Amazing Grace", composer: "John Newton", voicePart: "All Parts" },
  ];
  
  const filteredMusic = searchQuery 
    ? placeholderSheetMusic.filter(
        item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.composer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : placeholderSheetMusic;
  
  return (
    <>
      <MusicAppHeader currentSection="sheet-music" />
      <div className="container py-6">
        <PageHeader
          title="Sheet Music Library"
          description="Access and view your sheet music collection"
          icon={<FileMusic className="h-6 w-6" />}
        />
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sheet music..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMusic.map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
              onClick={() => navigate(`/sheet-music/${item.id}`)}
            >
              <div className="bg-muted h-40 flex items-center justify-center">
                <FileMusic className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.composer}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {item.voicePart}
                  </span>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {filteredMusic.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 py-12 text-center text-muted-foreground">
              No sheet music found matching your search.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
