
import React, { useState, useRef } from "react";
import Papa from "papaparse";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, Upload, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define the structure of choral titles
interface ChoralTitleData {
  title: string;
  composer: string;
  voicing: string;
  amount_on_hand?: number;
}

// Props for the import dialog
interface ImportMappingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: (records: ChoralTitleData[]) => void;
}

interface ColumnMapping {
  title: string | null;
  composer: string | null;
  voicing: string | null;
  amount_on_hand: string | null;
}

export function ImportMappingDialog({ isOpen, onOpenChange, onImportComplete }: ImportMappingDialogProps) {
  const { toast } = useToast();
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview'>('upload');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    title: null,
    composer: null,
    voicing: null,
    amount_on_hand: null
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetDialog = () => {
    setParsedData([]);
    setHeaders([]);
    setPreviewData([]);
    setStep('upload');
    setColumnMapping({
      title: null,
      composer: null,
      voicing: null,
      amount_on_hand: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const csvData = e.target?.result as string;
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data.length === 0) {
              toast({
                title: "Error",
                description: "No valid data found in the file",
                variant: "destructive",
              });
              return;
            }

            // Extract headers from the first row
            const headers = Object.keys(results.data[0]);
            setHeaders(headers);
            setParsedData(results.data);

            // Auto-match columns if possible
            const autoMapping: ColumnMapping = {
              title: null,
              composer: null,
              voicing: null,
              amount_on_hand: null
            };

            headers.forEach(header => {
              const lowerHeader = header.toLowerCase();
              if (lowerHeader.includes('title')) autoMapping.title = header;
              if (lowerHeader.includes('composer')) autoMapping.composer = header;
              if (lowerHeader.includes('voicing') || lowerHeader.includes('voice') || lowerHeader.includes('arrangement')) autoMapping.voicing = header;
              if (lowerHeader.includes('amount') || lowerHeader.includes('quantity') || lowerHeader.includes('count') || lowerHeader.includes('copies')) autoMapping.amount_on_hand = header;
            });

            setColumnMapping(autoMapping);
            setStep('mapping');
          },
          error: (error) => {
            toast({
              title: "Parse Error",
              description: error.message || "Failed to parse the file",
              variant: "destructive",
            });
          }
        });
      } catch (error: any) {
        toast({
          title: "File Error",
          description: "Failed to read the file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    fileReader.readAsText(file);
  };

  const handleMappingChange = (field: keyof ColumnMapping, value: string | null) => {
    setColumnMapping(prev => ({ ...prev, [field]: value }));
  };

  const handlePreviewData = () => {
    if (!columnMapping.title || !columnMapping.composer || !columnMapping.voicing) {
      toast({
        title: "Mapping Incomplete",
        description: "Title, composer, and voicing fields are required for import.",
        variant: "destructive",
      });
      return;
    }

    try {
      const mappedData = parsedData.map((row) => ({
        title: columnMapping.title ? row[columnMapping.title] : "",
        composer: columnMapping.composer ? row[columnMapping.composer] : "",
        voicing: columnMapping.voicing ? row[columnMapping.voicing] : "",
        amount_on_hand: columnMapping.amount_on_hand && row[columnMapping.amount_on_hand] 
          ? parseInt(row[columnMapping.amount_on_hand], 10) 
          : 0
      }));

      // Filter out rows with missing required fields
      const validData = mappedData.filter(
        row => row.title && row.composer && row.voicing
      );

      if (validData.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid records found after mapping. Please check your column mapping.",
          variant: "destructive",
        });
        return;
      }

      setPreviewData(validData.slice(0, 5)); // Show first 5 records for preview
      setStep('preview');
    } catch (error: any) {
      toast({
        title: "Mapping Error",
        description: error.message || "Failed to map data",
        variant: "destructive",
      });
    }
  };

  const handleImport = () => {
    if (parsedData.length === 0) {
      toast({
        title: "Import Error",
        description: "No data to import",
        variant: "destructive",
      });
      return;
    }

    try {
      const mappedData = parsedData.map((row) => ({
        title: columnMapping.title ? row[columnMapping.title] : "",
        composer: columnMapping.composer ? row[columnMapping.composer] : "",
        voicing: columnMapping.voicing ? row[columnMapping.voicing] : "",
        amount_on_hand: columnMapping.amount_on_hand && row[columnMapping.amount_on_hand] 
          ? parseInt(row[columnMapping.amount_on_hand], 10) 
          : 0
      }));

      // Filter out rows with missing required fields
      const validData = mappedData.filter(
        row => row.title && row.composer && row.voicing
      );

      if (validData.length === 0) {
        toast({
          title: "Validation Error",
          description: "No valid records found after mapping. Please check your column mapping.",
          variant: "destructive",
        });
        return;
      }

      onImportComplete(validData);
      toast({
        title: "Import Prepared",
        description: `${validData.length} records ready for import.`,
      });
      onOpenChange(false);
      resetDialog();
    } catch (error: any) {
      toast({
        title: "Import Error",
        description: error.message || "Failed to process import",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
              <FileSpreadsheet className="w-12 h-12 mb-4 text-gray-400" />
              <p className="mb-2 text-sm text-center text-gray-500">
                Upload a CSV file with your choral titles data
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            <h3 className="font-medium">Map your CSV columns to the required fields</h3>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title-map" className="flex items-center">
                  Title <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select 
                  value={columnMapping.title || ""} 
                  onValueChange={(value) => handleMappingChange('title', value)}
                >
                  <SelectTrigger id="title-map">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="composer-map" className="flex items-center">
                  Composer <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select 
                  value={columnMapping.composer || ""} 
                  onValueChange={(value) => handleMappingChange('composer', value)}
                >
                  <SelectTrigger id="composer-map">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="voicing-map" className="flex items-center">
                  Voicing <span className="ml-1 text-red-500">*</span>
                </Label>
                <Select 
                  value={columnMapping.voicing || ""} 
                  onValueChange={(value) => handleMappingChange('voicing', value)}
                >
                  <SelectTrigger id="voicing-map">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount-map">
                  Quantity (optional)
                </Label>
                <Select 
                  value={columnMapping.amount_on_hand || ""} 
                  onValueChange={(value) => handleMappingChange('amount_on_hand', value)}
                >
                  <SelectTrigger id="amount-map">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>{header}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handlePreviewData} className="bg-glee-purple hover:bg-glee-purple/90">
                Preview
              </Button>
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Data Preview</h3>
              <p className="text-sm text-muted-foreground">
                (Showing first {Math.min(previewData.length, 5)} of {parsedData.length} records)
              </p>
            </div>

            {previewData.length > 0 && (
              <div className="border rounded-md overflow-auto max-h-60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Composer</TableHead>
                      <TableHead>Voicing</TableHead>
                      <TableHead>Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.title}</TableCell>
                        <TableCell>{row.composer}</TableCell>
                        <TableCell>{row.voicing}</TableCell>
                        <TableCell>{row.amount_on_hand}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button onClick={handleImport} className="bg-glee-purple hover:bg-glee-purple/90">
                Import {parsedData.length} Records
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Choral Titles</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderStep()}
        </div>

        <DialogFooter className="items-center">
          {step !== 'upload' && (
            <span className="text-xs text-muted-foreground mr-auto">
              <AlertTriangle className="inline-block w-3 h-3 mr-1" />
              Title, composer, and voicing are required fields
            </span>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
