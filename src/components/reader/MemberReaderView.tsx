
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePDFLibrary, PDFFile } from '@/hooks/usePDFLibrary';
import { Music, Search, Eye, BookOpen, ListMusic } from 'lucide-react';
import { PDFThumbnail } from '@/components/pdf/PDFThumbnail';
import { SetlistManager } from './SetlistManager';
import AdvancedPDFViewer from '@/components/pdf/AdvancedPDFViewer';
import { Spinner } from '@/components/ui/spinner';

export function MemberReaderView() {
  const { pdfFiles, loading } = usePDFLibrary();
  const [selectedPDF, setSelectedPDF] = useState<PDFFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('library');

  const voiceParts = [
    { value: 'all', label: 'All Parts' },
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  const filteredPDFs = pdfFiles.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVoicePart = selectedVoicePart === 'all' || pdf.voice_part === selectedVoicePart;
    return matchesSearch && matchesVoicePart;
  });

  const handleViewPDF = (pdf: PDFFile) => {
    setSelectedPDF(pdf);
  };

  const handleBackToLibrary = () => {
    setSelectedPDF(null);
  };

  // If a PDF is selected, show the viewer
  if (selectedPDF) {
    return (
      <div className="h-screen">
        <AdvancedPDFViewer 
          url={selectedPDF.file_url} 
          title={selectedPDF.title}
          sheetMusicId={selectedPDF.id}
          onBack={handleBackToLibrary}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Music className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-[#003366] dark:text-white">Music Reader</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Access your sheet music library and create setlists
        </p>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library">Sheet Music Library</TabsTrigger>
              <TabsTrigger value="setlists">My Setlists</TabsTrigger>
            </TabsList>
            
            <TabsContent value="library" className="mt-6">
              {/* Quick Filters */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search sheet music..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedVoicePart} onValueChange={setSelectedVoicePart}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Voice Part" />
                      </SelectTrigger>
                      <SelectContent>
                        {voiceParts.map(part => (
                          <SelectItem key={part.value} value={part.value}>
                            {part.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Sheet Music Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Spinner />
                </div>
              ) : filteredPDFs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No sheet music found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery || selectedVoicePart !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'Sheet music will appear here when available'
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredPDFs.map((pdf) => (
                    <Card key={pdf.id} className="group hover:shadow-lg transition-all cursor-pointer" onClick={() => handleViewPDF(pdf)}>
                      <div className="relative">
                        <div className="h-32 sm:h-40 bg-gray-100 rounded-t-lg overflow-hidden">
                          <PDFThumbnail 
                            url={pdf.file_url} 
                            title={pdf.title}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm mb-1 line-clamp-2" title={pdf.title}>
                          {pdf.title}
                        </h3>
                        {pdf.voice_part && (
                          <Badge variant="secondary" className="text-xs">
                            {voiceParts.find(v => v.value === pdf.voice_part)?.label || pdf.voice_part}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="setlists" className="mt-6">
              <SetlistManager onViewPDF={handleViewPDF} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
