
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePDFLibrary, PDFFile } from '@/hooks/usePDFLibrary';
import { FileText, Search, Upload, Eye, Download, Trash2, Filter } from 'lucide-react';
import { PDFThumbnail } from '@/components/pdf/PDFThumbnail';
import { Spinner } from '@/components/ui/spinner';

interface PDFLibraryViewProps {
  onViewPDF: (pdf: PDFFile) => void;
  onUploadPDF?: () => void;
}

export function PDFLibraryView({ onViewPDF, onUploadPDF }: PDFLibraryViewProps) {
  const { pdfFiles, loading, deletePDF } = usePDFLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoicePart, setSelectedVoicePart] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const voiceParts = [
    { value: 'all', label: 'All Voice Parts' },
    { value: 'soprano_1', label: 'Soprano 1' },
    { value: 'soprano_2', label: 'Soprano 2' },
    { value: 'alto_1', label: 'Alto 1' },
    { value: 'alto_2', label: 'Alto 2' },
    { value: 'tenor', label: 'Tenor' },
    { value: 'bass', label: 'Bass' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'sacred', label: 'Sacred' },
    { value: 'secular', label: 'Secular' },
    { value: 'classical', label: 'Classical' },
    { value: 'contemporary', label: 'Contemporary' },
    { value: 'spiritual', label: 'Spiritual' }
  ];

  const filteredPDFs = pdfFiles.filter(pdf => {
    const matchesSearch = pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pdf.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVoicePart = selectedVoicePart === 'all' || pdf.voice_part === selectedVoicePart;
    const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
    
    return matchesSearch && matchesVoicePart && matchesCategory;
  });

  const handleDelete = async (pdf: PDFFile) => {
    if (confirm(`Are you sure you want to delete "${pdf.title}"?`)) {
      await deletePDF(pdf.id, pdf.file_path);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#003366] dark:text-white">PDF Library</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {filteredPDFs.length} {filteredPDFs.length === 1 ? 'document' : 'documents'}
          </p>
        </div>
        {onUploadPDF && (
          <Button onClick={onUploadPDF} className="bg-orange-500 hover:bg-orange-600">
            <Upload className="h-4 w-4 mr-2" />
            Upload PDF
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search PDFs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedVoicePart} onValueChange={setSelectedVoicePart}>
                <SelectTrigger className="w-48">
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
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PDF Grid */}
      {filteredPDFs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No PDFs found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedVoicePart !== 'all' || selectedCategory !== 'all' 
                ? 'Try adjusting your filters'
                : 'Upload your first PDF to get started'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPDFs.map((pdf) => (
            <Card key={pdf.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  <PDFThumbnail 
                    url={pdf.file_url} 
                    title={pdf.title}
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onViewPDF(pdf)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => window.open(pdf.file_url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(pdf)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-2 line-clamp-2" title={pdf.title}>
                  {pdf.title}
                </h3>
                {pdf.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {pdf.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mb-2">
                  {pdf.voice_part && (
                    <Badge variant="secondary" className="text-xs">
                      {voiceParts.find(v => v.value === pdf.voice_part)?.label || pdf.voice_part}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {pdf.category}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(pdf.created_at).toLocaleDateString()}
                  {pdf.file_size && (
                    <span className="ml-2">
                      • {(pdf.file_size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
