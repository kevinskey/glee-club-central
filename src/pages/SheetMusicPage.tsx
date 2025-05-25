
import React, { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FileMusic, Search, Filter } from "lucide-react";
import { MusicAppHeader } from "@/components/layout/MusicAppHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import EnhancedPDFViewer from "@/components/pdf/EnhancedPDFViewer";

export default function SheetMusicPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const navigate = useNavigate();
  
  // This would be integrated with actual sheet music data in a real implementation
  const placeholderSheetMusic = [
    { 
      id: "1", 
      title: "Ave Maria", 
      composer: "Franz Schubert", 
      voicePart: "Soprano",
      file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    { 
      id: "2", 
      title: "Hallelujah", 
      composer: "Leonard Cohen", 
      voicePart: "All Parts",
      file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    { 
      id: "3", 
      title: "The Storm Is Passing Over", 
      composer: "Charles A. Tindley", 
      voicePart: "Alto",
      file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
    { 
      id: "4", 
      title: "Amazing Grace", 
      composer: "John Newton", 
      voicePart: "All Parts",
      file_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
    },
  ];
  
  const filteredMusic = searchQuery 
    ? placeholderSheetMusic.filter(
        item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               item.composer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : placeholderSheetMusic;

  const handleViewPDF = (item: any) => {
    setSelectedPDF(item);
  };

  const handleBackToList = () => {
    setSelectedPDF(null);
  };

  // If a PDF is selected, show the enhanced viewer
  if (selectedPDF) {
    return (
      <div className="h-screen flex flex-col">
        <MusicAppHeader currentSection="sheet-music" />
        <div className="flex-1">
          <EnhancedPDFViewer 
            url={selectedPDF.file_url} 
            title={`${selectedPDF.title} - ${selectedPDF.composer}`}
            onBack={handleBackToList}
          />
        </div>
      </div>
    );
  }
  
  return (
    <>
      <MusicAppHeader currentSection="sheet-music" />
      <div className="container py-6">
        <PageHeader
          title="Sheet Music Library"
          description="Access and view your sheet music collection with enhanced PDF viewing"
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
              onClick={() => handleViewPDF(item)}
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
                  <Button variant="ghost" size="sm">View PDF</Button>
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
